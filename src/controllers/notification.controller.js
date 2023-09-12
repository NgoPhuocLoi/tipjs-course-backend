const { OkResponse } = require("../core/success.response");
const NotificationService = require("../services/notification.service");

class NotificationController {
  static async getNotificationsByUser(req, res) {
    new OkResponse({
      message: "OK",
      metadata: await NotificationService.getNotificationsByUser(req.query),
    }).send(res);
  }
}

module.exports = NotificationController;
