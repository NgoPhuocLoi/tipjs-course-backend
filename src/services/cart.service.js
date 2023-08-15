const { BadRequest } = require("../core/error.response");
const CartModel = require("../models/cart.model");
const { cartRepo, productRepo } = require("../models/repositories");

class CartService {
  // need to check if there is any product with productId
  static async addToCart({ userId, product = {} }) {
    const userCart = await cartRepo.checkUserCartExisted(userId);

    if (userCart && (await cartRepo.cartContainsProduct(product))) {
      return await cartRepo.updateProductQuantityInCart({ userId, product });
    }

    return await cartRepo.addProductToCart({ userId, product });
  }

  /*
    data from FE:
    {
      userId: ...,
      shop_oders:[
        {
          shopId:...
          products: [
            {
              productId: ...,
              shopId: ....,
              quantity: ....,
              old_quantity: ....
            }
          ]
        }
      ]
    }
  */

  static async updateCart({ userId, shop_orders }) {
    const { productId, quantity, old_quantity } = shop_orders[0]?.products[0];
    const foundProduct = await productRepo.findOneProduct({
      product_id: productId,
      unselect: [],
    });

    if (!foundProduct) throw new BadRequest("Product not found!");
    console.log(foundProduct, shop_orders[0].shopId);
    if (shop_orders[0].shopId !== foundProduct.product_shop + "")
      throw new BadRequest("Invalid ShopID!");

    if (+quantity === 0) {
      return await cartRepo.pullProductFromCart({ userId, productId });
    }

    return await cartRepo.updateProductQuantityInCart({
      userId,
      product: {
        productId,
        quantity: +quantity - +old_quantity,
      },
    });
  }

  static async deleteProductFromCart({ userId, productId }) {
    return await cartRepo.pullProductFromCart({ userId, productId });
  }

  static async getProductsInCart({ userId }) {
    return await cartRepo.checkUserCartExisted(+userId);
  }
}

module.exports = CartService;
