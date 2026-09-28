const Joi = require("joi");

const categorySchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required().min(10).max(100),
  });


module.exports = categorySchema;