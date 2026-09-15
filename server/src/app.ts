import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { notFoundHandler } from "./middlewares/not-found-handler";
import { errorHandler } from "./middlewares/error-handler";
import { setupScalar } from "./configs/scalar";
import healthRoutes from "./routes/health.routes";
import authRoutes from "./routes/auth.routes";
import accountsRoutes from "./routes/accounts.routes";
import transactionsRoutes from "./routes/transactions.routes";
import attachmentsRoutes from "./routes/attachments.routes";
import usersRoutes from "./routes/users.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import sourceMapSupport from "source-map-support";

sourceMapSupport.install();

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Idempotency-Key",
      "idempotency-key"
    ],
    credentials: true
  })
);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));

setupScalar(app);

app.get("/", (req: Request, res: Response) => {
  res.redirect("/api/v1/health");
});

app.use("/api/v1/health", healthRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1/me", usersRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/accounts", accountsRoutes);
app.use("/api/v1/transactions", transactionsRoutes);
app.use("/api/v1/attachments", attachmentsRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1", dashboardRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
