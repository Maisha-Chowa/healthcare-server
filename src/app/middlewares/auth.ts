import { NextFunction, Request, Response } from "express";
import { jwtHelpers } from "../../helpers/jwthelpers";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import ApiError from "../errors/ApiError";
import httpStatus from "http-status";

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
      }
      const verifiedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.jwt_secret as Secret
      );
      //   console.log("verified-user:", verfiedUser);
      req.user = verifiedUser;

      if (roles.length && !roles.includes(verifiedUser.role)) {
        console.log("not authorized");
        throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
      } else {
        next();
      }
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
