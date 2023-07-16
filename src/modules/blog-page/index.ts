/**
 * @file index.js
 * @summary Blog pages routes.
 * */
import { getPages, getPage, savePage, readPage } from "./blogPage.controller";
import { Router } from "express";

export default function blogPage(router: Router) {
  router.get("/pages/", getPages);
  router.get("/pages/:pageId", getPage);
  // Temporary for demo.
  router.get("/pages/save/:pageId", savePage);
  router.get("/pages/read/:pageId", readPage);
}
