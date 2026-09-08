import { Router } from "express";
import multer from "multer";
import {
  getProfile,
  updatePreferences,
  updateAvatar
} from "../controllers/users.controller";
import { authenticate, requireRole } from "../middlewares/auth.middleware";

const usersRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

usersRouter.use(authenticate, requireRole(["USER", "ADMIN"]));

usersRouter.get("/me", getProfile);
usersRouter.get("/", getProfile);

usersRouter.patch("/me", updatePreferences);
usersRouter.patch("/", updatePreferences);

usersRouter.post("/me/avatar", upload.single("file"), updateAvatar);
usersRouter.post("/avatar", upload.single("file"), updateAvatar);

export default usersRouter;
