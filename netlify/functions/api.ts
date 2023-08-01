import express, { Router } from "express";
import serverless from "serverless-http";
import initiateRoutes from "../../src/modules";

const api = express();

const router = Router();

initiateRoutes(router);
api.use("/API/V2", router);

export const handler = serverless(api);
