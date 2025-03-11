import { Request, Response } from "express";
import { userService } from "./user.service";

const createAdmin = async (req: Request, res: Response) => {
  // console.log(req.body);
  try {
    const result = await userService.createAdmin(req.body);
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

export const userController = {
  createAdmin,
};
