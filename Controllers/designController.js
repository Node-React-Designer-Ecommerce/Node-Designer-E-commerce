const AppError = require("../Utils/AppError");
const Design = require("../Models/designModel");

// 1- get all designs
exports.getAllDesigns = async (req, res, next) => {
  const designs = await Design.find();
  if (!designs) {
    throw new AppError("No designs found", 404);
  }
  res.status(200).send({
    status: "sucsess",
    message: "Designs Retreived Successfully",
    data: { designs },
  });
};

// 2- get one design by id
exports.getDesignById = async (req, res, next) => {
  const designId = req.params.id;
  const design = await Design.findById(designId);
  if (!design) {
    throw new AppError("No design found with taht ID ", 404);
  }
  res.status(200).send({
    status: "sucsess",
    message: "Design Retreived Successfully",
    data: { design },
  });
};

// 3- create new design
exports.createDesign = async (req, res, next) => {
  const design = await Design.create({ ...req.body });
  if (!design) {
    throw new AppError("Error creating design", 400);
  }
  res.status(201).send({
    status: "success",
    message: "design created successfully",
    data: {
      design,
    },
  });
};

// 4- update design by id

exports.updateDesign = async (req, res, next) => {
  const designId = req.params.id;

  const design = await Design.findByIdAndUpdate(
    { _id: designId },
    { ...req.body },
    { new: true, runValidators: true }
  );
  res.send({
    status: "success",
    message: "design updated successfully",
    data: { design },
  });
};

// 5- delete design by id

exports.deleteDesign = async (req, res, next) => {
  await Design.deleteOne({ _id: req.params.id });
  res
    .status(204)
    .send({ status: "success", message: "game deleted successfully" });
};