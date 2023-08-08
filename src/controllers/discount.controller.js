const { CreatedResponse, OkResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
  static async createDiscountCode(req, res, next) {
    const shopId = req.shop.shop;
    new CreatedResponse({
      message: "Discount code is created!",
      metadata: await DiscountService.createDiscountCode({
        shopId,
        ...req.body,
      }),
    }).send(res);
  }

  static async updateDiscountCode(req, res, next) {
    const code = req.params.discountCode;
    new OkResponse({
      message: "Update successfully!",
      metadata: await DiscountService.updateDiscountCode(code, req.body),
    }).send(res);
  }

  static async getAllProductsByDiscountCode(req, res, next) {
    const { shopId, code, page, limit } = req.query;

    new OkResponse({
      message: "OK!",
      metadata: await DiscountService.getAllProductsByDiscountCode({
        shopId,
        code,
        page,
        limit,
      }),
    }).send(res);
  }

  static async getAllDiscountCodesByShop(req, res, next) {
    const shopId = req.shop.shop;
    new OkResponse({
      message: "OK!",
      metadata: await DiscountService.getAllDiscountCodesByShop({
        shopId,
        ...req.body,
      }),
    }).send(res);
  }

  static async getDiscountAmount(req, res, next) {
    new OkResponse({
      message: "OK!",
      metadata: await DiscountService.getDiscountAmount(req.body),
    }).send(res);
  }

  static async deleteDiscountCode(req, res, next) {
    const shopId = req.shop.shop;
    const code = req.params.code;
    new OkResponse({
      message: "OK!",
      metadata: await DiscountService.deleteDiscountCode({
        shopId,
        code,
      }),
    }).send(res);
  }

  static async cancelDiscountCode(req, res, next) {
    const shopId = req.shop.shop;
    new OkResponse({
      message: "OK!",
      metadata: await DiscountService.cancelDiscountCode({
        shopId,
        ...req.body,
      }),
    }).send(res);
  }
}

module.exports = DiscountController;
