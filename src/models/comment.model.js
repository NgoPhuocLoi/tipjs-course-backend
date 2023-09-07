const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Comment";
const COLLECTION_NAME = "comments";

const commentSchema = new Schema(
  {
    comment_productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    comment_content: {
      type: String,
      required: true,
    },
    comment_parentId: {
      type: Schema.Types.ObjectId,
    },
    comment_left: {
      type: Number,
      required: true,
    },
    comment_right: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, commentSchema);
