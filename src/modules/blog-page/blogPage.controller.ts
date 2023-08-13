require("config");
import {
  readPageIndex,
  saveBlogPage,
  savePageIndex,
  deleteBlogPage,
  listBlogPages,
  getBlogPage,
} from "./blogPage.service";
import { GetPagesHandler, GetPageHandler } from "./types";

/**
 * Get all blocks for a given page.
 *
 * */
const getPage: GetPageHandler = async (req, res, _next) => {
  const pageId = req.params.pageId;
  try {
    const page = await getBlogPage(pageId);
    res.status(200).send(page);
  } catch (error) {
    console.log(error);
    res.status(404).send("Not found");
  }
};

/**
 * Mongo DB: Save a page.
 *
 * */
const savePage: GetPageHandler = async (req, res, next) => {
  const pageId = req.params.pageId;
  try {
    saveBlogPage(pageId);
    res.status(200).send(`Page ${pageId} has been saved.`);
  } catch (error) {
    next(error);
  }
};

/**
 * Mongo DB: Save a page.
 *
 * */
const saveIndex: GetPageHandler = async (_req, res, next) => {
  try {
    savePageIndex();
    res.status(200).send(`Index has been saved`);
  } catch (error) {
    next(error);
  }
};

/**
 * Local files: Return the saved page index file.
 *
 * */
const getPageIndex: GetPageHandler = async (_req, res, next) => {
  const index = await readPageIndex().catch((error) => next(error));
  res.status(200).send(index);
};

/**
 * Read a page.
 *
 * */
const deletePage: GetPageHandler = async (req, res, next) => {
  const pageId = req.params.pageId;
  try {
    await deleteBlogPage(pageId);
    res.status(200).send("Page deleted.");
  } catch (error) {
    next(error);
  }
};

/**
 * Get the page list.
 *
 * */
const listPages: GetPagesHandler = async (_req, res, next) => {
  const pageList = await listBlogPages().catch((error: any) => next(error));
  console.log(pageList);
  res.status(200).send(pageList);
};

export {
  // Local files.
  savePage,
  getPageIndex,
  // Database related
  saveIndex,
  deletePage,
  listPages,
  // For SPA.
  getPage,
};
