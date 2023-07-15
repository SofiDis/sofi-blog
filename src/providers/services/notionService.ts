/**
 * @file notionService.ts
 * @summary Handle the connection with Notion.
 * */

const config = require("config");
// import util from "util";
// import fs from "fs";
import { Client } from "@notionhq/client";

const notionDb = config.get("services.notion.articlesDb");
const temporaryBlockId = "5d37552bd8a849c1a7613185c0a2c322";

const notion = new Client({
  auth: config.get("services.notion.token"),
});

/**
 * Get all pages in a specific Notion Database.
 *
 * @returns NotionPages | null
 * @example
 * // Returns all pages.
 * useNotionService().getPagesData()
 */
async function getPagesData() {
  const pagesData = await notion.databases.query({
    database_id: notionDb,
  });

  return pagesData;
}

/**
 * Get information of a specific Notion content block.
 *
 * @returns SiteModel | null
 * @example
 * // Returns all pages.
 * useNotionService().getPagesData()
 */
async function getBlockData(blockId: string = temporaryBlockId) {
  const pageContent = await notion.blocks.children.list({
    block_id: blockId,
    page_size: 50,
  });

  return pageContent;
}

export { notion, getPagesData, getBlockData };
