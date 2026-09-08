import { apiReference } from "@scalar/express-api-reference";
import { Express, Request, Response } from "express";
import openApiDocument from "../docs/openapi.json";

export const setupScalar = (app: Express) => {
  app.get("/api/docs/openapi.json", (_req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(openApiDocument);
  });

  app.use(
    "/api/docs",
    apiReference({
      spec: {
        content: openApiDocument
      },
      theme: "purple",
      pageTitle: "FinanCare API Reference"
    })
  );
};
