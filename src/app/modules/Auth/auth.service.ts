import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { jwtHelpers } from "../../../helpers/jwthelpers";
import { UserStatus } from "@prisma/client";
import config from "../../../config";
import emailSender from "./emailSender";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const loginUser = async (payload: { email: string; password: string }) => {
  console.log("User logged in", payload);
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });
  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  }

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
  console.log(accessToken);

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
  console.log("refreshToken", refreshToken);
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

const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );
  if (!isCorrectPassword) {
    throw new Error("Password incorrect!");
  }
  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);
  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });
  return {
    message: "Password changed successfully!",
  };
};

const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const resetPassToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.reset_pass_token_secret as Secret,
    config.jwt.reset_pass_token_expiresIn as
      | `${number}${"s" | "m" | "h" | "d"}`
      | number
  );
  console.log(resetPassToken);
  const resetPassLink =
    config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`;
  await emailSender(
    userData.email,
    `
    <div>
      <p>Dear User,</p>
            <p>Your password reset link 
                <a href=${resetPassLink}>
                    <button>
                        Reset Password
                    </button>
                </a>
            </p>
    </div>
    `
  );
};
const resetPassword = async (
  token: string,
  payload: {
    id: string;
    password: string;
  }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });

  const isValidToken = jwtHelpers.verifyToken(
    token,
    config.jwt.reset_pass_token_secret as Secret
  );
  if (!isValidToken) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!");
  }
  //hash password
  const password = await bcrypt.hash(payload.password, 12);
  //update into database
  await prisma.user.update({
    where: {
      id: payload.id,
    },
    data: {
      password,
    },
  });
};
export const AuthServices = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};

// http://localhost:3001/?userId=1869b8df-e169-4414-8ad9-d709fc25d913&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1haXNoYS5jaG93YUBnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDIwNTIxNjUsImV4cCI6MTc0NDY0NDE2NX0.nEAoJHgC3kdFft7t4F0h2UZb47U3UgwlTpenLiOUk04
