/**
 * @file writeReadData.js
 * @summary Temporary utilities to save and read data using filesystem.
 * */
const config = require("config");
import fs from "fs";

const storagePath = config.get("app.storagePath");

async function readPage(page: string) {
  const path = storagePath + page + ".json";
  fs.readFile(path, "utf8", (error, data) => {
    if (error) {
      console.log(error);
      return;
    }
    console.log(JSON.parse(data));
  });
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
