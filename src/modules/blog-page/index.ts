/**
 * @file index.js
 * @summary Blog pages routes.
 * */
import getPage from "./blogPage.controller";
import { Router } from "express";

export default function blogPage(router: Router) {
  router.get("/pages", getPage);
  // router.get("/users", async (req, res) => {
  //   const notionData = await getNotionData();
  //   //const page = notionData && notionData.results[2].heading_1;
  //   const pageContent = notionData && notionData.results;
  //   //const pageList = notionData && notionData;
  //   //console.log(pageList);

  //   // Print all the response.
  //   console.log(
  //     util.inspect(pageContent, false, null, true /* enable colors */)
  //   );

  //   PageStorage.writePage(testWriteData, "test");

  //   fs.exists("./src/storage/test.json", function (exists) {
  //     if (exists) {
  //       console.log("exist");
  //     } else {
  //       console.log("doesnt exists");
  //     }
  //   });
  //   // console.log(pageContent);
  //   // console.log(parsed);
  //   res.send("test pages");
  // });
}
