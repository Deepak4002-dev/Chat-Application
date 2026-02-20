import joi from "joi";

const signupSchema = joi.object({
  username: joi.string().required().min(3).messages({
    "string.base": "Username must be a string",
    "string.empty": "Username is required",
    "string.min": "Username must have at least 3 characters",
  }),

  email: joi.string().required().email().messages({
    "string.base": "Email must be a string",
    "string.empty": "Email is required",
    "string.email": "Invalid Email",
  }),

  password: joi
    .string()
    .required()
    .min(8) // You can set a minimum length for the password
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%&])[A-Za-z\\d!@#$%^&*]{8,}$",
      ),
    )
    .messages({
      "string.base": "Password must be a string",
      "string.empty": "Password is required",
      "string.pattern.base":
        "Password must have at least one lowercase letter, one uppercase letter, one number, and one special character.",
    }),

  confirmPassword: joi.string().required().valid(joi.ref("password")).messages({
    "any.only": "Password and Confirm Password must match",
    "string.empty": "Confirm Password is required",
  }),
});

const loginSchema = joi.object({
  email: joi.string().required().email().lowercase().trim().message({
    "string.base": "Email must be string",
    "string.empty": "Email is required",
    "string.email": "Invalid Email",
  }),
  password: joi
    .string()
    .required()
    .trim()
    .min(8)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%&])[A-Za-z\\d!@#$%^&*]{8,}$",
      ),
    )
    .messages({
      "string.base": "Password must be a string",
      "string.empty": "Password is required",
      "string.min": "Password Length must be minimum 8",
      "string.pattern.base":
        "Password must have at least one lowercase letter, one uppercase letter, one number, and one special character.",
    }),
});

export { signupSchema,loginSchema };
