const NotificationModel = require("../models/notification.model");

class NotificationService {
  static async pushNotification({ type, senderId, receiverId, options }) {
    let noti_content;
    switch (type) {
      case "SHOP-001":
        noti_content = "@@@ has created a new product: @@@@";
        break;
      case "PROMOTION-001":
        noti_content = "@@@ has created a new promotion: @@@@";
        break;
    }

    const noti = await NotificationModel.create({
      noti_type: type,
      noti_senderId: senderId,
      noti_receiverId: receiverId,
      noti_content,
      noti_options: options,
    });

    return noti;
  }

  static async getNotificationsByUser({
    userId = 1,
    type = "ALL",
    isRead = false,
  }) {
    const match = { noti_receiverId: userId };
    if (type !== "ALL") {
      match["noti_type"] = type;
    }

    return await NotificationModel.aggregate([
      {
        $match: match,
      },
      {
        $project: {
          noti_type: 1,
          noti_senderId: 1,
          noti_receiverId: 1,
          noti_content: 1,
          createdAt: 1,
        },
      },
    ]);
  }
}

module.exports = NotificationService;
