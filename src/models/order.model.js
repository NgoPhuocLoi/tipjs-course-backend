const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "orders";

const orderSchema = new Schema(
  {
    order_userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order_checkout: {
      type: Object,
      default: {},
    },
    order_products: {
      type: Array,
      required: true,
    },
    order_shippingInfo: {
      type: Object,
      default: {},
    },
    order_paymentInfo: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, orderSchema);
