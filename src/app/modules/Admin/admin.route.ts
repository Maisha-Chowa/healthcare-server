import express, { NextFunction, Request, Response } from "express";
import { AdminController } from "./admin.controller";

import validateRequest from "../../middlewares/validateRequest";
import { updateValidationSchema } from "./admin.validation";

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

router.get("/", AdminController.getAllfromDB);
router.get("/:id", AdminController.getByIdFromDB);
router.patch("/:id", validateRequest(updateValidationSchema.update), AdminController.updateIntoDB);
router.delete("/:id", AdminController.deleteFromDB);
router.delete("/softdelete/:id", AdminController.softdeleteFromDB);

export const AdminRoutes = router;
