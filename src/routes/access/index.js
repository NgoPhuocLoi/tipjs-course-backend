const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/handleError");
const { authentication } = require("../../middlewares/auth");
const router = require("express").Router();

router.post("/shop/signup", asyncHandler(accessController.signup));
router.post("/shop/login", asyncHandler(accessController.login));

// authentication
router.use(authentication);

router.post("/shop/logout", asyncHandler(accessController.logout));
router.post(
  "/shop/refreshtoken",
  asyncHandler(accessController.handleRefreshToken)
);

module.exports = router;
