const RedisPubSubService = require("../services/redisPubSub.service");

class ProductServiceTest {
  async purchaseProduct({ productId, quantity }) {
    const order = { productId, quantity };
    console.log("aaa1");
    await RedisPubSubService.publish("purchase_product", JSON.stringify(order));
    console.log("aaa2");
  }
}

class InventoryServiceTest {
  constructor() {
    RedisPubSubService.subscribe("purchase_product", this.updateInven).then(
      () => {
        console.log("Subscribed!");
      }
    );
  }

  async updateInven(order) {
    console.log("Inventory is updated with order :: " + JSON.stringify(order));
  }
}

module.exports = {
  ProductServiceTest: new ProductServiceTest(),
  InventoryServiceTest: new InventoryServiceTest(),
};
