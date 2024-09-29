let crypto = require("crypto");
const Order = require("./../Models/orderModel");
const queryString = require("query-string");
const _ = require("underscore");

const AppError = require("../Utils/AppError");

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
  if (!req.user.cart) {
    throw new AppError("Cart is empty", 400);
  }
  const totalPrice = req?.user?.cart.reduce((acc, curr) => {
    return acc + curr.price;
  }, 0);
  const order = await Order.create({
    customer: req.user._id,
    totalPrice,
    items: req.user.cart,
    paymentMethod,
  });
  if (!order) {
    throw new AppError("Failed to create order");
  }
  if (paymentMethod === "COD") {
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
  data.signatureKeys.sort();
  const objectSignaturePayload = _.pick(data, data.signatureKeys);
  const signaturePayload = queryString.stringify(objectSignaturePayload);
  const signature = crypto
    .createHmac("sha256", PaymentApiKey)
    .update(signaturePayload)
    .digest("hex");
  const kashierSignature = req.header("x-kashier-signature");
  if (kashierSignature === signature) {
    console.log("valid signature");
  } else {
    console.log("invalid signature");
  }
};
