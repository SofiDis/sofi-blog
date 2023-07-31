import { Router } from "express";
import {
  getPage,
  savePage,
  getPageList,
  getPageIndex,
  updatePageIndex,
  getSavedPages,
} from "./blogPage.controller";

export default function blogPage(router: Router) {
  // Local files.
  router.get("/pages/save/:pageId", savePage); // Updates page blocks of existing file.
  router.get("/pages/list", getSavedPages); // Retunr a list of saved files.
  router.get("/blog/index/", getPageIndex);
  router.get("/blog/index/save", updatePageIndex); // Updates or write the index file

  // For SPA.
  router.get("/pages/:pageId", getPage);
  router.get("/pages/", getPageList);
}
