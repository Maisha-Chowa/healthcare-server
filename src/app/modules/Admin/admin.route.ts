import express, { NextFunction, Request, Response } from "express";
import { AdminController } from "./admin.controller";

import validateRequest from "../../middlewares/validateRequest";
import { updateValidationSchema } from "./admin.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

// const update = z.object({
//   body: z.object({
//     name: z.string().optional(),
//     contactNumber: z.string().optional(),
//   }),
// });

// //higher order function
// const validateRequest =
//   (schema: AnyZodObject) =>
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       await schema.parseAsync({
//         body: req.body,
//       });
//       next();
//     } catch (err) {
//       next();
//     }
//   };

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminController.getAllfromDB
);
router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminController.getByIdFromDB
);
router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(updateValidationSchema.update),
  AdminController.updateIntoDB
);
router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminController.deleteFromDB
);
router.delete(
  "/softdelete/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminController.softdeleteFromDB
);

export const AdminRoutes = router;
