import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { jwtHelpers } from "../../../helpers/jwthelpers";
import { UserStatus } from "@prisma/client";
import config from "../../../config";

const loginUser = async (payload: { email: string; password: string }) => {
  console.log("User logged in", payload);
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );
  console.log(isCorrectPassword);
  if (!isCorrectPassword) {
    throw new Error("Password Incorrect");
  }
  //   const accessToken = jwt.sign(
  //     {
  //       email: userData.email,
  //       role: userData.role,
  //     },
  //     "123456",
  //     { algorithm: "HS256", expiresIn: "15m" }
  //   );

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expiresIn as `${number}${"s" | "m" | "h" | "d"}` | number
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expiresIn as
      | `${number}${"s" | "m" | "h" | "d"}`
      | number
  );
  return {
    accessToken,
    needPasswordChange: userData.needPasswordChange,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    console.log(token);
    decodedData = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_token_secret as Secret
    );
    console.log("decodeddata: ", decodedData);
  } catch (err) {
    throw new Error("You are not authorized");
  }
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData?.email,
      status: UserStatus.ACTIVE,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expiresIn as `${number}${"s" | "m" | "h" | "d"}` | number
  );

  return {
    accessToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const changePassword = async () => {};

export const AuthServices = {
  loginUser,
  refreshToken,
  changePassword,
};
