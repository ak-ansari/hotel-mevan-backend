import { Request, Response, NextFunction } from "express";
import { wsLogger } from "./logger";
import { ApiError } from "./api-error-response";

interface CustomError extends Error {
  status?: number;
}

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  wsLogger.error({message: err.message})

  const statusCode = err.status || 500;
  res.status(statusCode).send(new ApiError(statusCode,err.message).toJSON())
};

