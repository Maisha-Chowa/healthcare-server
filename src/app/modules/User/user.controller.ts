import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import pick from "../../../shared/pick";
import { userFilterAbleFields } from "./user.constants";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import { IAuthUser } from "../../interfaces/common";

const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
  // console.log(req.body);
  try {
    const result = await userService.createAdmin(req);
    // res.send(result);
    res.status(200).json({
      success: true,
      message: "Admin created successfully",
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: err,
    });
  }
};

const createDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log(req.body);
  try {
    const result = await userService.createDoctor(req);
    // res.send(result);
    res.status(200).json({
      success: true,
      message: "Doctor created successfully",
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: err,
    });
  }
};
const createPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log(req.body);
  try {
    const result = await userService.createPatient(req);
    // res.send(result);
    res.status(200).json({
      success: true,
      message: "Patient created successfully",
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: err,
    });
  }
};

const getAllfromDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("query: ", req.query);
    const filters = pick(req.query, userFilterAbleFields); // here filters is getting a object like { searchTerm: 'chowa', contactNumber: '0123456789' }
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    console.log("options:", options);
    const result = await userService.getAllfromDB(filters, options);
    // res.status(200).json({
    //   success: true,
    //   message: "Admin data fetched !",
    //   meta: result.meta,
    //   data: result.data,
    // });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin data fetched !",
      meta: result.meta,
      data: result.data,
    });
  } catch (err) {
    // console.log(err);
    // res.status(500).json({
    //   success: false,
    //   message: "Something went wrong",
    //   error: err,
    // });
    next(err);
  }
};

const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userService.changeProfileStatus(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users profile status changed!",
    data: result,
  });
});

const getMyProfile = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;

    const result = await userService.getMyProfile(user as IAuthUser);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My profile data fetched!",
      data: result,
    });
  }
);

const updateMyProfile = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;

    const result = await userService.updateMyProfile(user as IAuthUser, req);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My profile updated!",
      data: result,
    });
  }
);
export const userController = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllfromDB,
  changeProfileStatus,
  getMyProfile,
  updateMyProfile,
};
