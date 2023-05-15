const { CreatedResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");
class ProductController {
  static async createProduct(req, res, next) {
    const shopId = req.shop.shop;
    new CreatedResponse({
      message: "Product has been created successfully!",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: shopId,
      }),
    }).send(res);
  }
}

module.exports = ProductController;
