import {
  BlockObjectResponse,
  PageObjectResponse,
  PartialBlockObjectResponse,
  PartialPageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

import { getPagesData } from "../../providers/services/notionService";
import { ContentBlock, Page, PageList } from "./types";

import pageStorage from "../../utils";
import { collections } from "../../core/mongoDb";

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
 * Read page index saved in the database.
 *
 */
async function readPageIndex(): Promise<any | null> {
  if (!collections.blogIndex) return null;

  const blogIndex = await collections.blogIndex
    .find({})
    .toArray()
    .catch((error) => console.log(error));

  if (!blogIndex) return null;

  console.log(blogIndex);

  return blogIndex[0];
}

/**
 * Build index from Notion and
 * save/update in the database.
 *
 */
async function savePageIndex(): Promise<void | null> {
  const notionData = await indexPages().catch((error) => console.log(error));

  const index = {
    updatedAt: new Date(),
    content: notionData,
  };

  if (!notionData || !collections.blogIndex) return null;

  // Remove old index.
  await collections.blogIndex.deleteMany({});

  try {
    const result = await collections.blogIndex.insertOne(index);
    console.log("Index", result);
  } catch (error) {
    console.error(error);
  }
}

/**
 * Get a page content from Notion and
 * save it in the database.
 *
 */
async function saveBlogPage(pageId: string): Promise<void | null> {
  const pageContent = await getPageContent(pageId).catch((error) =>
    console.log(error)
  );

  const page = {
    id: pageId,
    title: "My page title",
    content: pageContent ?? [],
  };

  try {
    if (!collections.blogPage) return;
    const result = await collections.blogPage.insertOne(page);
    console.log("db result", result);
  } catch (error) {
    console.error(error);
  }
}

/**
 * Delete a page from the database.
 *
 */
async function deleteBlogPage(pageId: string): Promise<void | null> {
  try {
    if (!collections.blogPage) return;

    await collections.blogPage.deleteOne({ id: pageId });

    console.log("Page deleted");
  } catch (error) {
    console.error(error);
  }
}

/**
 * List all pages saved in the database.
 *
 */
async function listBlogPages(): Promise<PageList> {
  try {
    if (!collections.blogPage) return [];

    const pages = await collections.blogPage
      .find({})
      .toArray()
      .catch((error) => console.log(error));

    const pageList =
      pages &&
      pages.map((item) => {
        return {
          id: item.id,
          title: item.title,
        };
      });

    console.log(pages);

    return pageList || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

/**
 * Get a saved page.
 *
 */
async function getBlogPage(pageId: string): Promise<Partial<Page> | null> {
  const query = { id: pageId };

  if (!collections.blogPage) return null;

  const page = await collections.blogPage
    .findOne(query)
    .catch((error) => console.log(error));

  if (!page) return null;

  let pageContent: ContentBlock[] = [];

  if (!page.content) throw new Error("Page not found");

  page?.content.forEach((item: any, index: number) => {
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

  return { id: pageId, title: page.title, content: pageContent };
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
  writePageIndex,
  buildPageIndex,
  // Related to database.
  saveBlogPage,
  savePageIndex,
  readPageIndex,
  deleteBlogPage,
  listBlogPages,
  // Spa
  getBlogPage,
};
