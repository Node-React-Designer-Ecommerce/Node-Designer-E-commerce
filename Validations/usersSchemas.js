const Joi = require("joi");
// Joi schema for user signup
const signupSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  address: Joi.string().min(3).max(100).required(),
  phone: Joi.string()
    .pattern(/^01[0125][0-9]{8}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be a valid Egyptian number.",
    }),
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number.",
    }),
  passwordConfirm: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
  }),
});

// Joi schema for login validation
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required",
  }),
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$/)
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.empty": "Password is required",
    }),
});

const resetPasswordSchema = Joi.object({
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number.",
    }),
  passwordConfirm: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({ "any.only": "Passwords do not match" }),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .min(8)
    .max(30)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$/)
    .required()
    .messages({
      "string.min": "Current password must be at least 8 characters long",
      "string.empty": "Current password is required",
    }),
  newPassword: Joi.string()
    .min(8)
    .max(30)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$/)
    .required()
    .messages({
      "string.pattern.base":
        "New password must contain at least one uppercase letter, one lowercase letter, and one number.",
    }),
  passwordConfirm: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "New passwords do not match",
    }),
});

module.exports = {
  signupSchema,
  loginSchema,
  resetPasswordSchema,
  changePasswordSchema,
};
