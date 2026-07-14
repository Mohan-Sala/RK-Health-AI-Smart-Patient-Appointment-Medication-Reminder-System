import rateLimit from "express-rate-limit";
import { errorResponse } from "../utils/apiResponse.js";
import { HTTP_STATUS } from "../utils/constants.js";

// Standard rate limiter for global API protection
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 150, // Limit each IP to 150 requests per windowMs
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again after 15 minutes",
  handler: (req, res, next, options) => {
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json(
      errorResponse(options.message, null, HTTP_STATUS.TOO_MANY_REQUESTS)
    );
  },
});
