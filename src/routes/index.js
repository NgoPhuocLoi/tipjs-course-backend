const router = require("express").Router();
const { apiKey, permission } = require("../middlewares/auth");

// check ApiKey
router.use(apiKey);

//check permissions
router.use(permission("0000"));

router.use("/v1/api/product", require("./product"));
router.use("/v1/api", require("./access"));

module.exports = router;
