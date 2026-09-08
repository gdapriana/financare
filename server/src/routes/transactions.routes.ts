import { Router } from "express";
import {
  getTransactions,
  createTransaction,
  getTransactionById,
  updateTransaction,
  deleteTransaction
} from "../controllers/transactions.controller";
import { authenticate, requireRole } from "../middlewares/auth.middleware";

const transactionsRouter = Router();

transactionsRouter.use(authenticate, requireRole(["USER", "ADMIN"]));

transactionsRouter.get("/", getTransactions);
transactionsRouter.post("/", createTransaction);
transactionsRouter.get("/:id", getTransactionById);
transactionsRouter.patch("/:id", updateTransaction);
transactionsRouter.delete("/:id", deleteTransaction);

export default transactionsRouter;
