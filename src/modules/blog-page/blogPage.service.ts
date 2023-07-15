/**
 * @file blogPage.service.ts
 * @summary Handle the transformation of the Notion data.
 * */

// import { Client } from "@notionhq/client";
// import pageStorage from "@/utils";
// import config from "config";
// import util from "util";
// import fs from "fs";

import { getPagesData } from "../../providers/services/notionService";

async function readNotionPage() {
  //const page = await pageStorage.readPage("test");
  const notionPages = await getPagesData();

  console.log(notionPages);
}

export { readNotionPage };
