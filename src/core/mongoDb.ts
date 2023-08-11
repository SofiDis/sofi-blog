import * as mongoDB from "mongodb";

const uri = process.env.MONGO_CONNECTION || "";

export const collections: {
  blogPage?: mongoDB.Collection;
  blogIndex?: mongoDB.Collection;
} = {};

export async function connectToDatabase() {
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(uri);

  await client.connect();

  const db: mongoDB.Db = client.db(process.env.MONGO_DB_NAME);

  const blogPageCollection: mongoDB.Collection = db.collection(
    process.env.BLOGPAGE_COLLECTION_NAME ?? ""
  );
  collections.blogPage = blogPageCollection;
  collections.blogPage.createIndex({ id: 1 }, { unique: true });

  const blogIndexCollection: mongoDB.Collection = db.collection(
    process.env.BLOGINDEX_COLLECTION_NAME ?? ""
  );
  collections.blogIndex = blogIndexCollection;

  console.log(
    `Successfully connected to db: ${db.databaseName} and collection: ${blogPageCollection.collectionName}`
  );
}
