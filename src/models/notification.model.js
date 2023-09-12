const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "notifications";
/**
 * SHOP-001: new product was created!
 * ORDER-001: order successfully
 * ORDER-002: order failed
 * PROMOTION-001: new promotion was created!
 */

const notificationSchema = new Schema(
  {
    noti_type: {
      type: String,
      enum: ["SHOP-001", "ORDER-001", "ORDER-002", "PROMOTION-001"],
      required: true,
    },
    noti_senderId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    noti_receiverId: {
      type: Number,
      required: true,
    },
    noti_content: {
      type: String,
      required: true,
    },
    noti_options: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, notificationSchema);
