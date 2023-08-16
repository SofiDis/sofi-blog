/**
 * @file index.js
 * @summary Initiate and expose routes
 * */

import { Router } from "express";
import { blogPage } from "./blog-page";

const initiateRoutes = (router: Router) => {
  blogPage(router);
};

export { initiateRoutes };
