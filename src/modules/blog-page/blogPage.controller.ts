require("config");
import {
  getLocalPageContent,
  writePage,
  readLocalPage,
  readPageIndex,
  writePageIndex,
  readAllPages,
  listPages,
} from "./blogPage.service";
import { GetPagesHandler, GetPageHandler } from "./types";

/**
 * Get all blocks for a given page.
 *
 * */
const getPage: GetPageHandler = async (req, res, _next) => {
  const pageId = req.params.pageId;
  try {
    const page = await getLocalPageContent(pageId);
    res.status(200).send(page);
  } catch (error) {
    console.log(error);
    res.status(404).send("Not found");
  }
};

/**
 * Local file: Save locally a page.
 *
 * */
const savePage: GetPageHandler = async (req, res, _next) => {
  const pageId = req.params.pageId;
  try {
    writePage(pageId);
    res.status(200).send(`Page ${pageId} has been saved.`);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Local files: Return all pages saved as files.
 *
 * */
const getSavedPages: GetPageHandler = async (_req, res, _next) => {
  const pages = await readAllPages().catch((error) => console.log(error));
  res.status(200).send(pages);
};

/**
 * Local files: Return the saved page index file.
 *
 * */
const getPageIndex: GetPageHandler = async (_req, res, _next) => {
  const index = await readPageIndex().catch((error) => console.log(error));
  res.status(200).send(index);
};

/**
 * Local files: Updates the page index file.
 *
 * */
const updatePageIndex: GetPagesHandler = async (_req, res, _next) => {
  const pageList = await writePageIndex().catch((error) => console.log(error));
  console.log(pageList);
  res.status(200).send("List of pages is updated.");
};

/**
 * Read a page.
 *
 * */
const readPage: GetPageHandler = async (req, res, _next) => {
  const pageId = req.params.pageId;
  try {
    const page = await readLocalPage(pageId);
    res.status(200).send(page);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Get the page list.
 *
 * */
const getPageList: GetPagesHandler = async (_req, res, _next) => {
  const pageList = await listPages().catch((error) => console.log(error));
  console.log(pageList);
  res.status(200).send(pageList);
};

export {
  // Local files.
  savePage,
  getSavedPages,
  readPage,
  updatePageIndex,
  getPageIndex,
  // For SPA.
  getPage,
  getPageList,
};
