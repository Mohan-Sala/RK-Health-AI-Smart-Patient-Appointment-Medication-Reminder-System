import { BadRequestError } from "../utils/customError.js";

/**
 * Reusable schema validation wrapper utilizing Zod
 * @param {import("zod").ZodSchema} schema 
 */
export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    const formattedErrors = err.errors?.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    })) || err.message;
    
    return next(new BadRequestError("Request validation failed", formattedErrors));
  }
};
