import express from "express";
import "./core/common";
import { connectToDatabase } from "./core/mongoDb";
import initiateRoutes from "./modules";
import { errorMiddleware } from "./middlewares/httpError";

const router = express.Router();
const app = express();
const port = 3008;
const errorMiddl = errorMiddleware();

// Conect to the database.
connectToDatabase().catch(console.dir);

// Initalise routes.
initiateRoutes(router);

app.use("/api/v1", router);

app.get("/", (_req, res) => {
  res.send("Sofia's blog based on Notion integration.");
});

app.use(function (_req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access", "application/json");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

// Error handling middleware.
app.use(errorMiddl.logger);
app.use(errorMiddl.responder);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
