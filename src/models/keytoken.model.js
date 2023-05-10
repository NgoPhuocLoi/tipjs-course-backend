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
    refreshTokensUsed: {
      type: Array,
      default: [],
    },
    //current refreshToken
    refreshToken: {
      type: String,
      required: true,
    },
  },
  {
    collection: COLLECTIONS_NAME,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, tokenKeySchema);
