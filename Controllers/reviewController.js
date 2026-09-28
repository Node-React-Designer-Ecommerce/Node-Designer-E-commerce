const Review = require("../Models/reviewModel");

exports.getAllReviews = async (req, res, next) => {
  let filter = {};
  if (req.params.productId) filter = { product: req.params.productId };
  const reviews = await Review.find(filter);

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: { reviews },
  });
};

exports.setProductsUserIds = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createReview = async (req, res, next) => {
  //   if (!req.body.product) req.body.product = req.params.productId;
  //   if (!req.body.user) req.body.user = req.user.id;
  const newReview = await Review.create(req.body);

  res.status(200).json({
    status: "success",
    data: { review: newReview },
  });
};

exports.getReview = async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: { review },
  });
};

exports.updateReview = async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: { review },
  });
};

exports.deleteReview = async (req, res, next) => {
  await Review.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
};