import { ObjectId } from "mongodb";

export default class BlogPage {
  constructor(
    public title: string,
    public content: number,
    public updatedAt: string,
    public id?: ObjectId
  ) {}
}
