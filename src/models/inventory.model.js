const { Schema, Types, model } = require("mongoose");

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "inventories";

const inventorySchema = new Schema(
  {
    inven_productId: {
      type: Types.ObjectId,
      ref: "Product",
    },
    inven_shopId: {
      type: Types.ObjectId,
      ref: "Shop",
    },
    inven_stock: {
      type: Number,
      required: true,
    },
    inven_location: {
      type: String,
      default: "unKnow",
    },
    inven_reservations: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, inventorySchema);
