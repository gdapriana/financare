import { Router } from "express";
import {
  getSummary,
  getCalendar,
  getCalendarDateDetails
} from "../controllers/dashboard.controller";
import { authenticate, requireRole } from "../middlewares/auth.middleware";

const dashboardRouter = Router();

dashboardRouter.use(authenticate, requireRole(["USER", "ADMIN"]));

dashboardRouter.get("/summary", getSummary);

dashboardRouter.get("/calendar", getCalendar);
dashboardRouter.get("/calendar/:date", getCalendarDateDetails);

export default dashboardRouter;
