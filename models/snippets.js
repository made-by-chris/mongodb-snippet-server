import mongoose from "mongoose";
import { conn } from "./index.js";

const SnippetSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    shortId: String,
    language: String,
    visibility: {
      type: String,
      enum: ["public", "private", "unlisted"],
      default: "public",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

const Snippet = conn.model("snippet", SnippetSchema);
export { Snippet };
