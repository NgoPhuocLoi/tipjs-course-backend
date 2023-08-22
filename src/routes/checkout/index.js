const router = require("express").Router();
const CheckoutController = require("../../controllers/checkout.controller");
const { asyncHandler } = require("../../helpers/handleError");

router.post("/review", asyncHandler(CheckoutController.checkoutReview));

module.exports = router;
