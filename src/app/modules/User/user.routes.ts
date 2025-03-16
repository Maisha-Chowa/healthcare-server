import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../../helpers/fileUploader";
import { v2 as cloudinary } from "cloudinary";
import { userValidation } from "./user.validation";

const router = express.Router();

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(process.cwd(), "uploads"));
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// (async function () {
//   // Configuration

//   cloudinary.config({
//     cloud_name: "dud3mvlpc",
//     api_key: "186991461197838",
//     api_secret: "_SJTndqe31pqyOmpk4dYNAXfDHo", // Click 'View API Keys' above to copy your API secret
//   });

//   // Upload an image

//   const uploadResult = await cloudinary.uploader
//     .upload(
//       "E:\\Projects\\Healthcare-Project\\healthcare-server\\uploads\\PXL_20240128_012431638.jpg",
//       {
//         public_id: "shoes",
//       }
//     )
//     .catch((error) => {
//       console.log(error);
//     });

//   console.log(uploadResult);

// // Optimize delivery by resizing and applying auto-format and auto-quality
// const optimizeUrl = cloudinary.url("shoes", {
//   fetch_format: "auto",
//   quality: "auto",
// });

// console.log(optimizeUrl);

// // Transform the image: auto-crop to square aspect_ratio
// const autoCropUrl = cloudinary.url("shoes", {
//   crop: "auto",
//   gravity: "auto",
//   width: 500,
//   height: 500,
// });

// console.log(autoCropUrl);
// })();
router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data));
    return userController.createAdmin(req, res, next);
  }
);

export const userRoutes = router;
