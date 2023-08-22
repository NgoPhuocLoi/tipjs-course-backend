const { OkResponse } = require("../core/success.response");
const CheckoutService = require("../services/checkout.service");

class CheckoutController {
  static async checkoutReview(req, res) {
    new OkResponse({
      message: "OK",
      metadata: await CheckoutService.checkoutReview(req.body),
    }).send(res);
  }
}

module.exports = CheckoutController;
