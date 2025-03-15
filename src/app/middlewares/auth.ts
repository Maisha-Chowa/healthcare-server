import { NextFunction, Request, Response } from "express";
import { jwtHelpers } from "../../helpers/jwthelpers";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import ApiError from "../errors/ApiError";
import httpStatus from "http-status";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
      }
      const verfiedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.jwt_secret as Secret
      );
      console.log("verified-user:", verfiedUser);

      if (roles.length && !roles.includes(verfiedUser.role)) {
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
