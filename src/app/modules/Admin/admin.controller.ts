import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import { adminFilterableFields } from "./admin.constant";
import pick from "../../../shared/pick";

const getAllfromDB = async (req: Request, res: Response) => {
  try {
    // console.log(req.query);
    const filters = pick(req.query, adminFilterableFields); // here filters is getting a object like { searchTerm: 'chowa', contactNumber: '0123456789' }
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    console.log(options);
    const result = await AdminService.getAllfromDB(filters,options);
    res.status(200).json({
      success: true,
      message: "Admin data fetched !",
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
export const AdminController = {
  getAllfromDB,
};
