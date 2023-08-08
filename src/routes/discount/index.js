const DiscountController = require("../../controllers/discount.controller");
const { asyncHandler } = require("../../helpers/handleError");
const { authentication } = require("../../middlewares/auth");

const router = require("express").Router();

router.post("/amount", asyncHandler(DiscountController.getDiscountAmount));
router.get(
  "/products",
  asyncHandler(DiscountController.getAllProductsByDiscountCode)
);

router.use(authentication);

router.post("/", asyncHandler(DiscountController.createDiscountCode));
router.patch(
  "/:discountCode",
  asyncHandler(DiscountController.updateDiscountCode)
);
router.get("/", asyncHandler(DiscountController.getAllDiscountCodesByShop));
router.delete("/:code", asyncHandler(DiscountController.deleteDiscountCode));
router.post("/cancel", asyncHandler(DiscountController.cancelDiscountCode));

module.exports = router;
