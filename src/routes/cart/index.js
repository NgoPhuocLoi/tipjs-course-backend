const CartController = require("../../controllers/cart.controller");
const { asyncHandler } = require("../../helpers/handleError");
const { authentication } = require("../../middlewares/auth");

const router = require("express").Router();

router.use(authentication);
router.post("/", asyncHandler(CartController.addToCart));
router.post("/update", asyncHandler(CartController.updateCart));
router.delete("/", asyncHandler(CartController.deleteProductFromCart));
router.get("/", asyncHandler(CartController.getProductsInCart));

module.exports = router;
