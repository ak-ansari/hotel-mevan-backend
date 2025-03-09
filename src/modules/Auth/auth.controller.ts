import PrismaClient from "../../db/db";
import { IUser } from "../../interface";
import { ApiError, asyncWrapper, compare, hash, signToken, verifyToken } from "../../utils";
import { Request, Response } from "express";

const signIn = asyncWrapper(async (req: Request, res: Response) => {
  const { email, password } = req.body as IUser;
  if (!email || !password)
    throw new ApiError(401, `email and password must be provided`);
  const user = await PrismaClient.user.findFirst({ where: { email } });
  if (!user) throw new ApiError(401, `Invalid email or password`);
  if (!await compare(password, user.password))
    throw new ApiError(401, `Invalid email or password`);
  const accessToken = signToken(user, "access");
  const refreshToken = signToken({id:user.id.toString()}, "refresh");
  delete user.password;
  res.status(200).json({ accessToken, refreshToken, user });
});
const signUp = asyncWrapper(async (req: Request, res: Response) => {
  const user = req.body as IUser;
  if (!user.email || !user.password)
    throw new ApiError(401, `email and password must be provided`);
  const foundUser = await PrismaClient.user.findFirst({
    where: { email: user.email },
  });
  if (foundUser) throw new ApiError(401, `email already registered`);
  const hashed = await hash(user.password);
  const createdUser = await PrismaClient.user.create({
    data: { email: user.email, password: hashed },
  });
  delete createdUser.password;
  res.status(200).json(createdUser);
});
const refreshToken = asyncWrapper(async (req: Request, res: Response) => {
    const refreshToken = req.headers.refresh_token;
    if (!refreshToken) throw new ApiError(401, "No refresh token provided");
    const {id: userId} = verifyToken<{id: string}>(refreshToken as string);
    if (!userId) throw new ApiError(401, "Invalid refresh token");
    const user = await PrismaClient.user.findUnique({ where: { id: Number(userId) } });
    if (!user) throw new ApiError(401, "Invalid refresh token");
    const accessToken = signToken(user, "access");
    res.status(200).json({ accessToken });
})
export {signIn,signUp,refreshToken}