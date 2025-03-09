import jwt from "jsonwebtoken";

export const signToken = (
  payload: Record<string, unknown> | string,
  type: "access" | "refresh"
) => {
  const expiry = type === "access" ? "1d" : "30d";
  return jwt.sign(payload, process.env.JWT_KEY as string, {
    expiresIn: expiry,
  });
};
export const verifyToken = <T>(token: string): T =>
  jwt.verify(token, process.env.JWT_KEY) as T;
