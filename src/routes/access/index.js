const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../middlewares/handleError");
const router = require("express").Router();

router.post("/shop/signup", asyncHandler(accessController.signup));
router.post("/shop/login", asyncHandler(accessController.login));

module.exports = router;
