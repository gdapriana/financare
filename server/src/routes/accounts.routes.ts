import { Router } from "express";
import {
  getAccounts,
  createAccount,
  getAccountById,
  updateAccount,
  archiveAccount
} from "../controllers/accounts.controller";
import { authenticate, requireRole } from "../middlewares/auth.middleware";

const accountsRouter = Router();

accountsRouter.use(authenticate, requireRole(["USER", "ADMIN"]));

accountsRouter.get("/", getAccounts);
accountsRouter.post("/", createAccount);
accountsRouter.get("/:id", getAccountById);
accountsRouter.patch("/:id", updateAccount);
accountsRouter.post("/:id/archive", archiveAccount);

export default accountsRouter;
