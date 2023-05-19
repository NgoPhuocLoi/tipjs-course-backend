const { CreatedResponse, OkResponse } = require("../core/success.response");
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

  static async findAllDraftsForShop(req, res, next) {
    const shopId = req.shop.shop;
    new OkResponse({
      message: "Get draft products for shop successfully!",
      metadata: await ProductService.findAllDraftsForShop({ shopId }),
    }).send(res);
  }

  static async findAllPublishedForShop(req, res, next) {
    const shopId = req.shop.shop;
    new OkResponse({
      message: "Get published products for shop successfully!",
      metadata: await ProductService.findAllPublishedForShop({ shopId }),
    }).send(res);
  }

  static async publishProductByShop(req, res, next) {
    const shopId = req.shop.shop;
    const productId = req.params.id;
    new OkResponse({
      message: "Product has been published!",
      metadata: await ProductService.publishProductByShop({
        shopId,
        productId,
      }),
    }).send(res);
  }

  static async unPublishProductByShop(req, res, next) {
    const shopId = req.shop.shop;
    const productId = req.params.id;
    new OkResponse({
      message: "Product has been unpublished!",
      metadata: await ProductService.unPublishProductByShop({
        shopId,
        productId,
      }),
    }).send(res);
  }

  static async searchProductsByUser(req, res, next) {
    const textSearch = req.query.keyword;
    new OkResponse({
      message: "OK",
      metadata: await ProductService.searchProducts({
        textSearch,
      }),
    }).send(res);
  }
}

module.exports = ProductController;
