import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
  getMe,
  updateMe
} from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const authRouter = Router();

authRouter.post("/auth/register", register);
authRouter.post("/auth/login", login);
authRouter.post("/auth/refresh", refresh);
authRouter.post("/auth/logout", logout);

authRouter.get("/me", authenticate, getMe);
authRouter.patch("/me", authenticate, updateMe);

export default authRouter;
