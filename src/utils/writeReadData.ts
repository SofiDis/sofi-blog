/**
 * @file writeReadData.js
 * @summary Temporary utilities to save and read data using filesystem.
 * */
const config = require("config");
import fs from "fs";

const storagePath = config.get("app.storagePath");

async function readPage(page: string) {
  const path = storagePath + page + ".json";

  try {
    const data = fs.readFileSync(path, "utf8");
    console.log(JSON.parse(data));
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
    return;
  }
}

async function writePage(content: any, pageName: string) {
  const path = storagePath + pageName + ".json";
  const parsed = JSON.stringify(content);
  fs.writeFile(path, parsed, (err) => {
    if (!err) {
      console.log("done");
    }
  });
}

export default { readPage, writePage };
