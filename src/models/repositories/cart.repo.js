const CartModel = require("../cart.model");

const checkUserCartExisted = async (userId) => {
  return await CartModel.findOne({ cart_userId: userId, cart_state: "active" });
};

const addProductToCart = async ({ userId, product }) => {
  const query = { cart_userId: userId, cart_state: "active" },
    update = {
      $addToSet: {
        cart_products: product,
      },
    },
    options = { upsert: true, new: true };

  return await CartModel.findOneAndUpdate(query, update, options);
};

const cartContainsProduct = async (product) => {
  return await CartModel.findOne({
    "cart_products.productId": product.productId,
  });
};

const updateProductQuantityInCart = async ({ userId, product }) => {
  const query = {
      cart_userId: userId,
      cart_state: "active",
      "cart_products.productId": product.productId,
    },
    update = {
      $inc: {
        "cart_products.$.quantity": product.quantity,
      },
    },
    options = { upsert: true, new: true };

  return await CartModel.findOneAndUpdate(query, update, options);
};

const pullProductFromCart = async ({ userId, productId }) => {
  const query = {
      cart_userId: userId,
      cart_state: "active",
    },
    update = {
      $pull: {
        cart_products: {
          productId,
        },
      },
    };

  return await CartModel.findOneAndUpdate(query, update, { new: true });
};

module.exports = {
  checkUserCartExisted,
  addProductToCart,
  cartContainsProduct,
  updateProductQuantityInCart,
  pullProductFromCart,
};
