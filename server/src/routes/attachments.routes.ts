import { Router } from "express";
import multer from "multer";
import {
  uploadAttachment,
  cancelAttachments,
  deleteAttachmentById,
  updateUserAvatar
} from "../controllers/attachments.controller";
import { authenticate, requireRole } from "../middlewares/auth.middleware";

const attachmentsRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

attachmentsRouter.use(authenticate, requireRole(["USER", "ADMIN"]));

attachmentsRouter.post("/upload", upload.any(), uploadAttachment);
attachmentsRouter.post("/cancel", cancelAttachments);
attachmentsRouter.delete("/:id", deleteAttachmentById);
attachmentsRouter.post("/avatar", upload.single("file"), updateUserAvatar);

export default attachmentsRouter;
