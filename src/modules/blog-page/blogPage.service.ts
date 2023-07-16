/**
 * @file blogPage.service.ts
 * @summary Handle the transformation of the Notion data.
 * */

import pageStorage from "../../utils";
import fs from "fs";

import {
  BlockObjectResponse,
  PageObjectResponse,
  PartialBlockObjectResponse,
  PartialPageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

import {
  getPagesData,
  getBlockData,
} from "../../providers/services/notionService";
import { ContentBlock, Page } from "./types";

/**
 * Create an array of pages from a Notion database.
 *
 */
async function indexPages(): Promise<Page[] | null> {
  // For now reading directly from Notion.
  const notionPages = await getPagesData();
  let pages: Page[] = [];

  notionPages?.forEach((item) => {
    if (isFullPageDataResponse(item)) {
      pages.push({
        id: item.id,
        title: "To solve this",
        createdAt: item.created_time,
        updatedAt: item.last_edited_time ?? item.created_time,
        tags: ["to solve it"],
      });
    }
  });

  // Parsering the data.
  return pages;
}

/**
 * Create a page from a Notion Page.
 *
 */
async function getPageContent(pageId: string): Promise<ContentBlock[] | null> {
  // For now reading directly from Notion.
  const notionPageBlocks = await getBlockData(pageId);

  let pageContent: ContentBlock[] = [];

  notionPageBlocks?.forEach((item, index) => {
    if (isFullBlockDataResponse(item)) {
      // Tweak to fix dynamic propertiy.
      const itemWithType = item as any;
      const itemType = itemWithType.type;

      pageContent.push({
        id: item.id,
        parentId: pageId,
        type: item?.type ?? "undefined",
        order: index,
        rich_text: itemWithType[itemType] ?? [],
        content: itemWithType[itemType].rich_text?.plain_text ?? "",
        color: itemWithType[itemType].color ?? "default",
      });
    }
  });

  return pageContent;
}

/**
 * Write a page index JSON file on local
 * This is a temporary solution to save data.
 *
 */
async function writePageIndex(): Promise<void | null> {}
async function readPageIndex(): Promise<void | null> {}

/**
 * Write a page JSON file on local
 * This is a temporary solution to save data.
 *
 */
async function writePage(pageId: string): Promise<void | null> {
  console.log("from service", pageId);
  const usePageStorage = pageStorage;
  const pageContent = await getPageContent(pageId);
  const page = {
    content: pageContent ?? [],
  };

  usePageStorage.writePage(page, pageId);

  // check if page exists.
  fs.exists(`./src/storage/${pageId}.json`, function (exists) {
    if (exists) {
      console.log("exist");
    } else {
      console.log("doesnt exists");
    }
  });
}

/**
 * Read a page JSON file locally.
 * This is a temporary solution to save data.
 *
 */
//TODO: fix type here.
async function readLocalPage(pageId: string): Promise<any | null> {
  const page = await pageStorage.readPage(pageId);
  return page;
}

// Helped here.
function isFullPageDataResponse(
  maybePartial: PageObjectResponse | PartialPageObjectResponse | null
): maybePartial is PageObjectResponse {
  if (!maybePartial) return false;

  return "properties" in maybePartial;
}

function isFullBlockDataResponse(
  maybePartial: PartialBlockObjectResponse | BlockObjectResponse | null
): maybePartial is BlockObjectResponse {
  if (!maybePartial) return false;

  return "type" in maybePartial;
}

// <3

export {
  indexPages,
  getPageContent,
  writePageIndex,
  readPageIndex,
  writePage,
  readLocalPage,
};
