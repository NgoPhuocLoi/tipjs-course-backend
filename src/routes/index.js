const router = require("express").Router();
const { apiKey, permission } = require("../middlewares/auth");
const { sendLogToDiscord } = require("../middlewares/logger");

// check ApiKey
router.use(apiKey);

//logger
router.use(sendLogToDiscord);

//check permissions
router.use(permission("0000"));

router.use("/v1/api/notification", require("./notification"));
router.use("/v1/api/comment", require("./comment"));
router.use("/v1/api/checkout", require("./checkout"));
router.use("/v1/api/product", require("./product"));
router.use("/v1/api/discount", require("./discount"));
router.use("/v1/api/cart", require("./cart"));
router.use("/v1/api", require("./access"));

module.exports = router;
