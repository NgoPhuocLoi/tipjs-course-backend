const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Key";
const COLLECTIONS_NAME = "Keys";

const tokenKeySchema = new Schema(
  {
    shop: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    publicKey: {
      type: String,
      required: true,
    },
    privateKey: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: Array,
      default: [],
    },
  },
  {
    collection: COLLECTIONS_NAME,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, tokenKeySchema);
