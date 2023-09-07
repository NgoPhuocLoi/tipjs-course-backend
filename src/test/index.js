const { ProductServiceTest, InventoryServiceTest } = require("./purchase.test");

setInterval(() => {
  ProductServiceTest.purchaseProduct({ productId: "001", quantity: 10 }).then(
    () => {
      console.log("Published");
    }
  );
}, 2000);
