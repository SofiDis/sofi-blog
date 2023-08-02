module.exports = {
  app: {
    url: process.env.URL || "http://localhost:3008",
    storagePath: "./src/storage/",
  },
  databases: {},
  services: {
    notion: {
      url: process.env.NOTION_URL || "",
      token: process.env.NOTION_TOKEN || "",
      articlesDb: process.env.NOTION_ARTICLES_DB || "",
    },
  },
};
