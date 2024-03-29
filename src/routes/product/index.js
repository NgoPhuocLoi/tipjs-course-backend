const router = require("express").Router();
const ProductController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../helpers/handleError");
const { authentication } = require("../../middlewares/auth");

router.get("/search", asyncHandler(ProductController.searchProductsByUser));
router.get("/", asyncHandler(ProductController.getAllProducts));
router.get("/:productId", asyncHandler(ProductController.getOneProduct));

router.use(authentication);

router.post("/", asyncHandler(ProductController.createProduct));
router.patch("/:id", asyncHandler(ProductController.updateProduct));

router.get("/drafts/all", asyncHandler(ProductController.findAllDraftsForShop));
router.get(
  "/published/all",
  asyncHandler(ProductController.findAllPublishedForShop)
);

router.put(
  "/publish/:id",
  asyncHandler(ProductController.publishProductByShop)
);
router.put(
  "/unpublish/:id",
  asyncHandler(ProductController.unPublishProductByShop)
);

module.exports = router;
