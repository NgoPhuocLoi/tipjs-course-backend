const InventoryModel = require("../inventory.model");

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unKnow",
}) => {
  return await InventoryModel.create({
    inven_productId: productId,
    inven_shopId: shopId,
    inven_stock: stock,
    inven_location: location,
  });
};

const reservationProduct = async ({ productId, quantity, cartId }) => {
  const query = {
    inven_productId: productId,
    inven_stock: { $gte: quantity },
  };

  const update = {
    $inc: {
      inven_stock: -quantity,
    },
    $push: {
      inven_reservations: {
        productId,
        cartId,
        createdAt: new Date(),
      },
    },
  };

  const options = {
    new: true,
    upsert: true,
  };

  return await InventoryModel.updateOne(query, update, options);
};

module.exports = {
  insertInventory,
  reservationProduct,
};
