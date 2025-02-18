import { Request, Response, NextFunction } from "express";

/**
 * A higher-order function to catch async errors in Express route handlers
 * @param {Function} fn - The async function to wrap
 * @returns {Function} A function that returns a Promise, catching async errors
 */
const catchAsync =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };

export default catchAsync;
