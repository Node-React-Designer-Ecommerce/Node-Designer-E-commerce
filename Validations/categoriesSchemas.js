const Joi = require("joi");

const categorySchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required().min(30).max(100),
  });


module.exports = categorySchema;