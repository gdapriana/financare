import { sql } from "drizzle-orm";
import db from "../configs/db";

export const getHealthStatus = async () => {
  await db.execute(sql`SELECT 1`);
  return {
    status: "healthy",
    timestamp: new Date().toISOString(),
    database: "connected"
  };
};

export const getDetailedHealthStatus = async () => {
  await db.execute(sql`SELECT 1`);
  return {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: "connected",
    environment: process.env.NODE_ENV || "development",
    version: process.env.npm_package_version || "1.0.0",
    memory: {
      used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
      total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
      unit: "MB"
    },
    cpu: {
      usage: process.cpuUsage()
    }
  };
};
