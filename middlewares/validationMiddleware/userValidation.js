import Joi from "joi";

import { buildErrorResponse } from "../../utility/responseHelper.js";
// https://joi.dev/api/?v=17.12.0

export const newUserValidation = (req, res, next) => {
  try {
    //model what your validation is
    const schema = Joi.object({
      firstName: Joi.string().min(3).required(),
      lastName: Joi.string().required(),
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
      address: Joi.string().required(),
      phone: Joi.string().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return buildErrorResponse(res, error.message)
    }

    next();
  } catch (error) {
    console.log(error);
    next()
  }
};