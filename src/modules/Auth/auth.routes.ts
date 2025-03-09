import { Router } from "express";
import { refreshToken, signIn, signUp } from "./auth.controller";

const userRouter= Router();
userRouter.post("/sign-in", signIn)
userRouter.post("/sign-up", signUp)
userRouter.post("/refresh-token", refreshToken);
export default userRouter