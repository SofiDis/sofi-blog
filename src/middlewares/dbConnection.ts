import { connectToDatabase } from "../core/mongoDb";

export const dbConnection = async function (_req: any, _res: any, next: any) {
  console.log("Try connection to db");
  await connectToDatabase();
  next();
};
