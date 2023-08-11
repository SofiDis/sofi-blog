import { Router } from "express";
import {
  getPage,
  savePage,
  getPageIndex,
  saveIndex,
  deletePage,
  listPages,
} from "./blogPage.controller";

export default function blogPage(router: Router) {
  // Related to MongoDB.
  router.get("/pages/save/:pageId", savePage);
  router.get("/blog/index/", getPageIndex);
  router.get("/blog/index/save", saveIndex);
  router.get("/pages/delete/:pageId", deletePage);
  router.get("/pages/list", listPages);

  // For SPA.
  router.get("/pages/:pageId", getPage);
}
