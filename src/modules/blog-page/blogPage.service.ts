import pageStorage from "../../utils";

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

const pageIndexFileName = "pageIndex";

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
      const itemNoType = item as any;

      const itemTitle = itemNoType?.properties?.Name?.title.map((item: any) => {
        return item.plain_text;
      });

      pages.push({
        id: item.id,
        title: itemTitle.join(" "),
        createdAt: item.created_time,
        updatedAt: item.last_edited_time ?? item.created_time,
      });
    }
  });

  return pages;
}

/**
 * Create a page index entity.
 *
 */
async function buildPageIndex(): Promise<any | null> {
  const allPages = await indexPages();

  const pagesIndex = {
    pageList:
      allPages?.map((item: Page) => {
        return {
          id: item.id,
          title: item.title ?? "",
          updatedAt: item.updatedAt,
        };
      }) ?? [],
  };

  return pagesIndex;
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
 * Get a local page content.
 *
 */
async function getLocalPageContent(pageId: string): Promise<any | null> {
  const usePageStorage = pageStorage;

  const localPage = await usePageStorage
    .readPage(pageId)
    .catch((error) => error);

  let pageContent: ContentBlock[] = [];

  if (!localPage.content) throw new Error("Page not found");

  localPage?.content.forEach((item: any, index: number) => {
    const itemWithType = item as any;
    const itemType = itemWithType.type;

    pageContent.push({
      id: item.id,
      parentId: pageId,
      type: item?.type ?? "undefined",
      order: index,
      rich_text: item?.rich_text ?? [],
      content: itemWithType[itemType]?.rich_text?.plain_text ?? "",
      color: itemWithType[itemType]?.color ?? "default",
    });
  });

  return { title: localPage.title, content: pageContent };
}

/**
 * Write a page index JSON file on local
 * This is a temporary solution to save data.
 *
 */
async function writePageIndex(): Promise<void | null> {
  const usePageStorage = pageStorage;
  const pageIndexData = await buildPageIndex();

  usePageStorage.writePage(pageIndexData, pageIndexFileName);
}

/**
 * Get the index page local JSON file.
 * This is a temporary solution to save data.
 *
 */
async function readPageIndex(): Promise<any | null> {
  const pageIndex = await pageStorage.readPage(pageIndexFileName);
  return pageIndex;
}

/**
 * Write a page JSON file on local
 * This is a temporary solution to save data.
 *
 */
async function writePage(pageId: string): Promise<void | null> {
  const usePageStorage = pageStorage;
  const pageContent = await getPageContent(pageId);
  const pageIndex = await readPageIndex();

  console.log(pageIndex.pageList);

  const pageData = pageIndex.pageList.filter(
    (item: any) => item.id === pageId
  )[0];

  const page = {
    title: pageData.title ?? "Undefined",
    content: pageContent ?? [],
  };

  usePageStorage.writePage(page, pageId);
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

/**
 * Read all JSON file pages stored locally.
 * This is a temporary solution to save data.
 *
 */
async function readAllPages(): Promise<Array<{
  name: string;
  date: Date;
}> | null> {
  const pages = await pageStorage
    .readAll()
    .catch((error) => console.log(error));

  if (!pages) return null;
  const convertedPage = pages.map((item) => {
    return { name: item.name, date: item.info.mtime };
  });

  return convertedPage;
}

/**
 * Retunr a list of pages
 *
 */
async function listPages(): Promise<Array<{
  name: string;
  date: Date;
}> | null> {
  const pageIndex = await readPageIndex().catch((error) => console.log(error));

  if (!pageIndex.pageList) return [];

  // TODO: decide how to fomrat data.
  const pageList = pageIndex.pageList?.map((item: any) => {
    return { [item.id]: { name: item.title, date: item.updatedAt } };
  });

  return pageList;
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
  getLocalPageContent,
  getPageContent,
  writePageIndex,
  readPageIndex,
  writePage,
  readLocalPage,
  buildPageIndex,
  readAllPages,
  listPages,
};
