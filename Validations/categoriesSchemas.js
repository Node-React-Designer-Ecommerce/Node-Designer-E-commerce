const joi = require("joi");

const categorySchema = joi.object({
    name: joi.string().required(),
    description: joi.string().required().min(30).max(100),
  });

  module.exports ={ categorySchema };