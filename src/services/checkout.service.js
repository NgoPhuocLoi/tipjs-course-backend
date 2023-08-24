const { NotFoundError, BadRequest } = require("../core/error.response");
const CartModel = require("../models/cart.model");
const OrderModel = require("../models/order.model");
const { productRepo } = require("../models/repositories");
const DiscountService = require("./discount.service");

const redisService = require("./redis.service");

class CheckoutService {
  /* Given the data from frontend: 
        {
            cartId,
            userId,
            shop_order_ids: [
                {
                    shopId: ...,
                    shop_discounts: [
                        {
                            shopId,
                            discountId,
                            code
                        }
                    ],
                    item_products: [
                        {
                            productId,
                            price,
                            quantity
                        }
                    ]
                }
            ]
        }
      
   */

  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    const cartFound = await CartModel.findOne({
      _id: cartId,
      cart_userId: userId,
      cart_state: "active",
    }).lean();

    if (!cartFound) throw new NotFoundError("Cart not found!");

    const checkoutOrder = {
      totalPrice: 0,
      feeShip: 0,
      totalDiscount: 0,
      finalPrice: 0,
    };

    const shop_order_ids_new = [];

    for (let shop of shop_order_ids) {
      console.log("SHOP:: " + shop.shopId);
      const productsReview = await productRepo.getReviewProducts(
        shop.item_products
      );
      let i = 0;
      for (let product of productsReview) {
        console.log(product.product_price, +shop.item_products[i].price);
        if (!product || product.product_price !== +shop.item_products[i].price)
          throw new BadRequest("Something went wrong! Please try again!");
        i++;
      }

      const checkoutPrice = shop.item_products.reduce((acc, product) => {
        return acc + +product.price * +product.quantity;
      }, 0);

      checkoutOrder.totalPrice += checkoutPrice;

      const shop_order = {
        ...shop,
        priceRaw: checkoutPrice,
        priceAfterDiscount: checkoutPrice,
      };
      if (shop.shop_discounts.length > 0) {
        const { discountAmount } = await DiscountService.getDiscountAmount({
          code: shop.shop_discounts[0].code,
          userId,
          shopId: shop.shopId,
          products: shop.item_products,
        });
        checkoutOrder.totalDiscount += discountAmount;
        shop_order.priceAfterDiscount -= discountAmount;
      }
      if (shop_order.priceAfterDiscount < 0) shop_order.priceAfterDiscount = 0;

      shop_order_ids_new.push(shop_order);
    }
    checkoutOrder.finalPrice =
      checkoutOrder.totalPrice - checkoutOrder.totalDiscount;
    return { checkoutOrder, shop_order_ids_new };
  }

  static async checkoutFinal({
    cartId,
    userId,
    shop_order_ids,
    user_address = {},
    user_payment = {},
  }) {
    const { checkoutOrder, shop_order_ids_new } = await this.checkoutReview({
      cartId,
      userId,
      shop_order_ids,
    });

    const products = shop_order_ids_new.flatMap((order) => order.item_products);

    console("products :: " + products);
    let reservationProductSuccess = true;
    products.forEach((product) => async () => {
      const { productId, quantity } = product;
      const keyLock = await redisService.acquireLock({
        productId,
        quantity,
        cartId,
      });
      reservationProductSuccess = reservationProductSuccess && !!keyLock;

      if (keyLock) {
        await redisService.releaseLock(keyLock);
      }
    });

    if (!reservationProductSuccess) {
      throw new BadRequest(
        "Some products have been changed! Please order again!"
      );
    }

    const order = await OrderModel.create({
      order_userId: userId,
      order_checkout: checkoutOrder,
      order_products: shop_order_ids_new,
      order_shippingInfo: user_address,
      order_paymentInfo: user_payment,
    });

    if (order) {
      // remove products in cart
    }

    return { order };
  }
}

module.exports = CheckoutService;
