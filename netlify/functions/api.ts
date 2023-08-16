import { dbConnection } from "./../../src/middlewares/dbConnection";
import express, { Router } from "express";
import serverless from "serverless-http";
import { initiateRoutes } from "../../src/modules";
import { errorMiddleware } from "../../src/middlewares/httpError";

const api = express();
const errorMiddl = errorMiddleware();

const router = Router();

initiateRoutes(router);

api.use(function (_req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access", "application/json");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

api.use(dbConnection);

api.use("/API/V2", router);

// Error handling middleware.
api.use(errorMiddl.logger);
api.use(errorMiddl.responder);

export const handler = serverless(api);
