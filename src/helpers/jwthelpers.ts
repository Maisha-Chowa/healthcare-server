import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { string } from "zod";

const generateToken = (
  payload: any,
  secret: Secret,
  expiresIn: `${number}${"s" | "m" | "h" | "d"}` | number
) => {
  console.log(expiresIn);
  console.log(typeof secret);
  const token = jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn,
  });

  return token;
};

const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
  generateToken,
  verifyToken,
};
