import express from "express";
import { nanoid } from "nanoid";
import { Snippet } from "../models/snippets.js";

const router = express.Router();

router.get("/", async function (request, response) {
  const userId = request.session.user?._id;
  const snippets = await Snippet.find({
    $or: [{ visibility: "public" }, { userId: userId }],
  })
    .sort({ createdAt: -1 })
    .limit(10);
  response.send(snippets);
});

router.get("/:shortId", async function (request, response) {
  const { shortId } = request.params;
  const userId = request.session.user?._id;
  const foundDocument = await Snippet.findOne({
    shortId: shortId,
    $or: [{ visibility: "public" }, { visibility: "unlisted" }, { userId: userId }],
  });
  if (foundDocument) {
    response.send(foundDocument);
  } else {
    response.status(404).send("snippet not found");
  }
});

router.post("/", async function (request, response) {
  const userId = request.session.user?._id;
  const newDocument = {
    shortId: nanoid(8),
    title: request.body.title,
    content: request.body.content,
    language: request.body.language || "plaintext",
    visibility: request.body.visibility || "public",
  };
  if (userId) {
    newDocument.userId = userId;
  }
  const createdSnippet = await Snippet.create(newDocument);
  response.send(createdSnippet);
});

router.delete("/:shortId", async function (request, response) {
  const userId = request.session.user?._id;
  const { shortId } = request.params;
  const foundSnippet = await Snippet.findOne({ shortId: shortId });
  if (!foundSnippet) {
    response.status(404).send("snippet not found");
    return;
  }
  if (userId === undefined || foundSnippet.userId !== userId) {
    response.status(403).send("you don't have permission to delete this snippet");
    return;
  }
  await Snippet.deleteOne({ shortId: shortId });
  response.send("snippet deleted");
});

router.put("/:shortId", async function (request, response) {
  const userId = request.session.user?._id;
  const { shortId } = request.params;
  const foundSnippet = await Snippet.findOne({ shortId: shortId });
  if (!foundSnippet) {
    response.status(404).send("snippet not found");
    return;
  }
  if (userId === undefined || foundSnippet.userId !== userId) {
    response.status(403).send("you don't have permission to update this snippet");
    return;
  }
  const updatedSnippet = await Snippet.findOneAndUpdate({ shortId: shortId }, request.body, { new: true });
  response.send(updatedSnippet);
});

export default router;
