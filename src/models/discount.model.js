const { Schema, Types, model } = require("mongoose");

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "discounts";

const discountSchema = new Schema(
  {
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: {
      type: String,
      enum: ["percentage", "fixed_amount"],
      default: "fixed_amount",
    },
    discount_value: { type: Number, required: true },
    discount_code: { type: String, required: true, unique: true },
    discount_startDate: { type: Date, required: true },
    discount_endDate: { type: Date, required: true },
    discount_maxUses: { type: Number, required: true },
    discount_usesCount: { type: Number, required: true },
    discount_usersUsed: { type: Array, default: [] },
    discount_maxUsesPerUser: { type: Number, required: true },
    discount_minOrderValue: { type: Number, required: true },
    discount_shopId: { type: Types.ObjectId, ref: "Shop" },
    discount_isActive: { type: Boolean, default: true },
    discount_appliesTo: {
      type: String,
      required: true,
      enum: ["all", "specific"],
    },
    discount_productIds: { type: Array, default: [] },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, discountSchema);
