let crypto = require("crypto");
const Order = require("./../Models/orderModel");
const queryString = require("query-string");
const _ = require("underscore");
const Product = require("./../Models/productModel");

const AppError = require("../Utils/AppError");
const logger = require("../Utils/logger");
const User = require("../Models/userModel");
const { log } = require("winston");
const { Console } = require("console");

function generateKashierOrderHash(amount, orderId) {
  const mid = "MID-28559-7"; //your merchant id
  // const amount = '200'; //eg: 22.00 ------------------------
  const currency = "EGP"; //eg: "EGP"
  // const orderId = '9'; //eg: 99 ---------------------------
  const secret = "ca770d42-0660-4917-b7c5-50e128f000c6";
  const path = `/?payment=${mid}.${orderId}.${amount}.${currency}`;
  const hash = crypto.createHmac("sha256", secret).update(path).digest("hex");
  return hash;
}

exports.createOrder = async (req, res, next) => {
  const { paymentMethod } = req.body;
  const user = req.user;
  if (!user.cart) {
    throw new AppError("Cart is empty", 400);
  }
  const totalPrice = user?.cart.reduce((acc, curr) => {
    return acc + curr.price;
  }, 0);
  const order = await Order.create({
    customer: user._id,
    totalPrice,
    items: user.cart,
    paymentMethod,
  });
  if (!order) {
    throw new AppError("Failed to create order");
  }
  if (paymentMethod === "COD") {
    user.cart = [];
    await user.save();
    return res.status(201).send({
      status: "success",
      message: "Order created successfully",
      data: { order },
    });
  }

  // generate kashier order hash
  const kashierOrderHash = generateKashierOrderHash(
    order.totalPrice,
    order._id
  );
  res.status(201).send({
    status: "success",
    message: "Order created successfully",
    data: { order, kashierOrderHash },
  });
};

exports.webhook = async (req, res) => {
  const { data, event } = req.body;
  console.log("kashier webhook request");
  console.log("orderId:", data.merchantOrderId);
  console.log("orderStatus:", data.status);
  console.log("----------------------------------");
  data.signatureKeys.sort();
  const objectSignaturePayload = _.pick(data, data.signatureKeys);
  const signaturePayload = queryString.stringify(objectSignaturePayload);
  const signature = crypto
    .createHmac("sha256", "ca770d42-0660-4917-b7c5-50e128f000c6")
    .update(signaturePayload)
    .digest("hex");
  const kashierSignature = req.header("x-kashier-signature");
  if (kashierSignature === signature) {
    console.log("valid signature");
    const order = await Order.findById(data.merchantOrderId);
    const customer = await User.findById(order.customer);
    if (!customer) {
      console.log("customer not found");
      return res.status(200).send();
    }
    if (!order) {
      console.log("order not found");
      return res.status(200).send();
    }
    if (data.status === "SUCCESS") {
      await updateProductsQuantitiy(order.items);
      console.log("order completed");
      order.paymentStatus = "Completed";
      order.orderStatus = "Completed";
      customer.cart = [];
      await customer.save();
    } else {
      order.paymentStatus = "Failed";
      order.orderStatus = "Rejected";
    }
    logger.info("order:", order._id, "updated to:", order.orderStatus);
    await order.save();
    res.status(200).send();
  } else {
    console.log("invalid signature");
  }
};
exports.getUserOrders = async (req, res, next) => {
  const orders = await Order.find({ customer: req.user._id }).populate({
    path: "items.product",
    select: "name description image category",
  });
  res.status(200).send({
    status: "success",
    message: "Orders get successfully",
    data: { orders },
  });
};

exports.getOrders = async (req, res, next) => {
  const orders = await Order.find()
    .populate({ path: "customer", select: "name email" })
    .populate({
      path: "items.product",
      select: "name description image category",
    });
  res.status(200).send({
    status: "success",
    message: "Orders get successfully",
    data: { orders },
  });
};

exports.UpdateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = await Order.findById(id);
  if (!order) {
    throw new AppError("Order not found", 400);
  }
  if (status) {
    await updateProductsQuantitiy(order.items);
    order.paymentStatus = "Completed";
    order.orderStatus = "Completed";
  } else {
    order.paymentStatus = "Failed";
    order.orderStatus = "Rejected";
  }
  logger.info("order:", order._id, "updated to:", order.orderStatus);
  await order.save();
  res.status(200).send({
    status: "success",
    message: "Order status updated successfully",
    data: { order },
  });
};

const updateProductsQuantitiy = async (items) => {
  const updatePromises = items.map(async (item) => {
    const product = await Product.findById(item.product);
    if (product) {
      const stockIndex = product.stock.findIndex(
        (stock) => stock.size === item.size
      );
      console.log(stockIndex);

      if (stockIndex !== -1) {
        product.stock[stockIndex].quantity -= item.quantity;
        await product.save();
      }
    }
  });
  await Promise.all(updatePromises);
};
