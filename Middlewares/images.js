const multer = require("multer");
const AppError = require("../Utils/AppError");
const ImageKit = require("imagekit");

// Configure ImageKit
// const imagekit = new ImageKit({
//   publicKey: "public_w8ASlEoPSOHndZrys4vBy204R24=",
//   privateKey: "private_v7YAUPQt47lo9CNLiJPas2qScaQ=",
//   urlEndpoint: "https://ik.imagekit.io/shadyyd",
// });

// Multer storage configuration to keep files in memory
const multerStorage = multer.memoryStorage();

// Filter to only allow image files
const multerFilterImage = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image, please upload only images.", 400), false);
  }
};

// Multer upload configuration
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilterImage,
});

// Middleware to upload images using Multer
exports.uploadImages = (fields) => {
  return upload.fields([
    ...fields.map((field) => ({ name: field.name, maxCount: field.count })),
  ]);
};

// Middleware to handle and upload images to ImageKit
exports.handleImages = (fieldname) => {
  return async (req, res, next) => {
    const files = req.files?.[fieldname];

    if (!files) return next();

    try {
      // Upload images to ImageKit
      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          const result = await imagekit.upload({
            file: file.buffer, // file buffer from multer
            fileName: `api-${Date.now()}-${Math.random()
              .toString(36)
              .substr(2, 9)}.jpeg`, // unique filename
            folder: "/uploads", // optional: specify folder in ImageKit
          });
          return result;
        })
      );

      // Store URLs of uploaded images in request body
      req.body[fieldname] = uploadedImages.map((file) => file.url);
      next();
    } catch (error) {
      return next(new AppError("Error uploading images to ImageKit", 500));
    }
  };
};
