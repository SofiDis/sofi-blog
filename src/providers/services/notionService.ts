/**
 * @file notionService.ts
 * @summary Handle the connection with Notion.
 * */

// Can not use import here.
const config = require("config");

import { Client } from "@notionhq/client";
import {
  BlockObjectResponse,
  PageObjectResponse,
  PartialBlockObjectResponse,
  PartialPageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

const notionDb = config.get("services.notion.articlesDb");
const temporaryBlockId = "5d37552bd8a849c1a7613185c0a2c322";

const notion = new Client({
  auth: config.get("services.notion.token"),
});

/**
 * Get all pages in a specific Notion Database.
 *
 */
async function getPagesData(): Promise<
  (PartialPageObjectResponse | PageObjectResponse)[] | null
> {
  const pagesData = await notion.databases.query({
    database_id: notionDb,
  });

  return pagesData.results;
}

/**
 * Get information of a specific Notion content block.
 *
 */
async function getBlockData(
  blockId: string = temporaryBlockId
): Promise<(PartialBlockObjectResponse | BlockObjectResponse)[]> {
  const pageContent = await notion.blocks.children.list({
    block_id: blockId,
    page_size: 50,
  });

  return pageContent.results;
}

export { notion, getPagesData, getBlockData };
