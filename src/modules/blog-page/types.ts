import { updateBlock } from "@notionhq/client/build/src/api-endpoints";
import { Handler, RequestHandler } from "express";

// Requests.
export type GetPagesHandler = Handler;
export type GetPageHandler = RequestHandler<{ pageId: string }>;

// Models

// Temporary gets type from Notions.
const notionTypekeys = [...updateBlock.bodyParams, "child_page"];
type NotionTypes = (typeof notionTypekeys)[number];

export type TextProperties = {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color: string;
};

export type BlockType = NotionTypes;

export type RichContent = {
  content: string;
  properties: TextProperties;
  href: string | null;
};

export type ContentBlock = {
  id: string;
  parentId: string;
  type: BlockType;
  order: number;
  rich_text: RichContent[];
  content: string;
  color: string;
};

export type Page = {
  id: string;
  dbId?: string;
  title?: string;
  createdAt: string;
  // Should be createdAt if not updated.
  updatedAt: string;
  tags?: string[];
  content?: ContentBlock[];
};

// const BLOCK_TYPES = {
//   PARAGRAPH: "paragraph",
//   H1: "h1",
//   H2: "h2",
//   H3: "h3",
//   CODE: "code",
//   IMAGE: "image",
//   BULLET_LIST: "bullet_list_item",
//   DIVIDER: "divider",
//   LINK: "link",
// };
