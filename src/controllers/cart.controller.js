const { OkResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
  static async addToCart(req, res) {
    new OkResponse({
      message: "Product was added!",
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  }

  static async getProductsInCart(req, res) {
    new OkResponse({
      message: "OK",
      metadata: await CartService.getProductsInCart(req.query),
    }).send(res);
  }

  static async updateCart(req, res) {
    new OkResponse({
      message: "Cart was updated!",
      metadata: await CartService.updateCart(req.body),
    }).send(res);
  }

  static async deleteProductFromCart(req, res) {
    new OkResponse({
      message: "OK",
      metadata: await CartService.deleteProductFromCart(req.body),
    }).send(res);
  }
}

module.exports = CartController;
