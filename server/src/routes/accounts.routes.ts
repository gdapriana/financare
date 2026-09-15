import { Router } from "express";
import {
  getAccounts,
  createAccount,
  getAccountById,
  updateAccount,
  archiveAccount,
  unarchiveAccount,
  deleteAccount
} from "../controllers/accounts.controller";
import { authenticate, requireRole } from "../middlewares/auth.middleware";

const accountsRouter = Router();

accountsRouter.use(authenticate, requireRole(["USER", "ADMIN"]));

accountsRouter.get("/", getAccounts);
accountsRouter.post("/", createAccount);
accountsRouter.get("/:id", getAccountById);
accountsRouter.patch("/:id", updateAccount);
accountsRouter.delete("/:id", deleteAccount);
accountsRouter.post("/:id/archive", archiveAccount);
accountsRouter.post("/:id/unarchive", unarchiveAccount);

export default accountsRouter;
