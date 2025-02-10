import { Request, Response, NextFunction } from "express";
import Joi, { Schema } from "joi";
import pick from "../utils/pick";
import ApiError from "../utils/ApiError";

/**
 * Middleware to validate request data based on a Joi schema
 * @param schema - The Joi schema to validate against
 * @returns Express middleware
 */
const validate = (schema: {
  params?: Schema;
  query?: Schema;
  body?: Schema;
}) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Pick the valid schema parts (params, query, body) from the schema
    const validSchema = pick(schema, ["params", "query", "body"]);
    // Pick the corresponding values from the request (req.params, req.query, req.body)
    const object = pick(req, Object.keys(validSchema) as (keyof Request)[]);

    // Validate the request data against the Joi schema
    const { value, error } = Joi.compile(validSchema)
      .prefs({ errors: { label: "key" }, abortEarly: false })
      .validate(object);

    // Handle validation error
    if (error) {
      const errorMessage = error.details
        .map((details: Joi.ValidationErrorItem) => details.message)
        .join(", ");
      return next(new ApiError(400, errorMessage));
    }

    // Assign the validated value to the request object
    Object.assign(req, value);

    // Proceed to the next middleware
    return next();
  };
};

export default validate;
