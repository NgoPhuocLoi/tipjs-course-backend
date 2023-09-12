const router = require("express").Router();
const NotificationController = require("../../controllers/notification.controller");
const { asyncHandler } = require("../../helpers/handleError");
const { authentication } = require("../../middlewares/auth");

router.use(authentication);

router.get("/", asyncHandler(NotificationController.getNotificationsByUser));

module.exports = router;
