require("config");
import {
  indexPages,
  getPageContent,
  writePage,
  readLocalPage,
  readPageIndex,
  writePageIndex,
} from "./blogPage.service";
import { GetPagesHandler, GetPageHandler } from "./types";

/**
 * Controller to get all pages.
 * @param req
 * @param res
 * @param next
 * */
const getPageIndex: GetPagesHandler = async (_req, res, _next) => {
  try {
    const pageList = await readPageIndex();
    res.status(200).send(pageList);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Controller to get all pages.
 * @param req
 * @param res
 * @param next
 * */
const updatePageIndex: GetPagesHandler = async (_req, res, _next) => {
  try {
    const pageList = await writePageIndex();
    console.log(pageList);
    res.status(200).send("List of pages is updated.");
  } catch (error) {
    console.log(error);
  }
};

/**
 * Controller to get all pages.
 * @param req
 * @param res
 * @param next
 * */
const getPages: GetPagesHandler = async (_req, res, _next) => {
  try {
    const notionPages = await indexPages();

    const pages = notionPages;
    console.log("mypages", pages);
    res.status(200).send(pages);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Controller to get all blocks for a given page.
 * @param req
 * @param res
 * @param next
 * */
const getPage: GetPageHandler = async (req, res, _next) => {
  const pageId = req.params.pageId;
  try {
    const page = await getPageContent(pageId);
    res.status(200).send(page);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Controller to save locally a page.
 * @param req
 * @param res
 * @param next
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
 * Controller to save locally a page.
 * @param req
 * @param res
 * @param next
 * */
const readPage: GetPageHandler = async (req, res, _next) => {
  const pageId = req.params.pageId;
  try {
    const page = await readLocalPage(pageId);
    console.log("fromController", page);
    res.status(200).send(page);
  } catch (error) {
    console.log(error);
  }
};

export { getPages, getPage, savePage, readPage, getPageIndex, updatePageIndex };
