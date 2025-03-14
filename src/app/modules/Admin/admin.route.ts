import express from "express";
import { AdminController } from "./admin.controller";

const router = express.Router();

router.get("/", AdminController.getAllfromDB);
router.get("/:id", AdminController.getByIdFromDB);
router.patch("/:id", AdminController.updateIntoDB);
router.delete("/:id", AdminController.deleteFromDB);
router.delete("/softdelete/:id", AdminController.softdeleteFromDB);

export const AdminRoutes = router;
