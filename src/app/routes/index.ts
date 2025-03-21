import { Router } from "express";
import { userRoutes } from "../modules/User/user.routes";
import { AdminRoutes } from "../modules/Admin/admin.route";
import { AuthRoutes } from "../modules/Auth/auth.routes";
const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/admin",
    route: AdminRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
