import { NextFunction, Response, Request } from "express";
import { ApiError } from "./api-error-response";
import { verifyToken } from "./jwt";
import { IUser } from "../interface";
declare module "express" {
  interface Request {
    userInfo: IUser;
    token: string;
  }
}
export const commonMiddleware = (
  req: Request,
  res: Response,
  next?: NextFunction
): void => {
  if(!isUrlProtected(req.originalUrl)){
    return next();
  }
  const token = req.headers.authorization?.replace("Bearer ","");
  if (!token) {
    res.status(401).json(new ApiError(401, "Invalid token"));
    return;
  }

  const user = verifyToken<IUser>(token);
  if (!user) {
    res.status(401).json(new ApiError(401, "Invalid token"));
    return;
  }
  req.userInfo = user;
  req.token = token;
  next();
};
function isUrlProtected(url: string): boolean {
  let isProtected = true
  const notProtectedRoutes = ["/auth/sign-up", "/auth/sign-in", "/auth/refresh-token"];
  notProtectedRoutes.forEach(path => {
    if (url === path){
      isProtected = false;
      return;
    }
  });
  return isProtected;
}