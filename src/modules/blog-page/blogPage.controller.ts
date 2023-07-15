require("config");
import { readNotionPage } from "./blogPage.service";

/**
 * Controller to get user data by id
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @param {function} next next method
 * */
const getPages = async (_req: any, res: any, _next: any) => {
  try {
    const pages = await readNotionPage();
    console.log(pages);
    res.status("200").send("test");
  } catch (error) {
    console.log(error);
  }
};

export default getPages;
