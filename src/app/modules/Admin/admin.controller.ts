import { NextFunction, Request, Response } from "express";
import { AdminService } from "./admin.service";
import { adminFilterableFields } from "./admin.constant";
import pick from "../../../shared/pick";
import { error } from "console";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const getAllfromDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // console.log(req.query);
    const filters = pick(req.query, adminFilterableFields); // here filters is getting a object like { searchTerm: 'chowa', contactNumber: '0123456789' }
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    console.log(options);
    const result = await AdminService.getAllfromDB(filters, options);
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

const getByIdFromDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await AdminService.getByIdFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin data fetched by id!",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
const updateIntoDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    console.log(id);
    console.log(req.body);
    const result = await AdminService.updateIntoDB(id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin data is updated !",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteFromDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await AdminService.deleteFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin data is deleted !",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
const softdeleteFromDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await AdminService.softdeleteFromDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin data is deleted !",
      data: result,
    });
  } catch (err) {
    // console.log(err);
    next(err);
  }
};
export const AdminController = {
  getAllfromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softdeleteFromDB,
};
