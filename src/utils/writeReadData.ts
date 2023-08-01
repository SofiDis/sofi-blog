const config = require("config");
import fs, { Stats } from "fs";

const fsp = fs.promises;
const storagePath = config.get("app.storagePath");
const pageFolder = "pages/";

async function readPage(page: string, folder: string = pageFolder) {
  const path = storagePath + folder + page + ".json";
  const file = await fsp.readFile(path);

  const convertedFile = JSON.parse(file.toString());

  return convertedFile;
}

async function writePage(content: any, pageName: string) {
  const path = storagePath + pageFolder + pageName + ".json";
  const parsed = JSON.stringify(content);
  fs.writeFile(path, parsed, (err) => {
    if (!err) {
      console.log("page saved");
    }
  });
}

async function readAll(): Promise<Array<{
  name: string;
  info: Stats;
}> | null> {
  const path = storagePath + pageFolder;
  const fileData = [];
  const files = await fsp.readdir(path);

  for (const filename of files) {
    const fileInfo = await fsp.stat(path + filename);
    fileData.push({ name: filename, info: fileInfo });
  }

  return fileData;
}

export default { readPage, writePage, readAll };
