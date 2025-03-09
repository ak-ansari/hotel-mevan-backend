import { NextFunction,Request,Response } from "express";

type RequestHandler = (
  req: Request,
  res: Response,
  next?: NextFunction
) => Promise<void>;
export const asyncWrapper = (handler: RequestHandler) => {
  return async (req: Request, res: Response, next?: NextFunction) => {
    try {
      await handler(req, res, next);
      next();
    } catch (error) {
      next(error);
    }
  };
};
