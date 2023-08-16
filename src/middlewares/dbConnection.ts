import { connectToDatabase } from "../core/mongoDb";

export const dbConnection = async function (_req, _res, next) {
  console.log("Try connection to db");
  await connectToDatabase();
  next();
};
