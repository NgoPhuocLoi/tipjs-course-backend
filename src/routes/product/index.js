const router = require("express").Router();
const ProductController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../helpers/handleError");
const { authentication } = require("../../middlewares/auth");

router.use(authentication);

router.post("/", asyncHandler(ProductController.createProduct));

module.exports = router;
