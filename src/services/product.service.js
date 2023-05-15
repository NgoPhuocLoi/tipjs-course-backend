const {
  ProductModel,
  ClothingModel,
  ElectronicModel,
} = require("../models/product.model");
const { BadRequest } = require("../core/error.response");
class ProductFactory {
  static async createProduct(type, payload) {
    switch (type) {
      case "Clothing":
        return await new Clothing(payload).createProduct();
      case "Electronic":
        return await new Electronic(payload).createProduct();
      default:
        throw new BadRequest("Invalid product's type!");
    }
  }
}

// Define base product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(productId) {
    return await ProductModel.create({ ...this, _id: productId });
  }
}
// define subclass: Clothing, Electronic

class Clothing extends Product {
  async createProduct() {
    const clothingProd = await ClothingModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!clothingProd)
      throw new BadRequest("An error occurs when creating clothing product!");

    const prod = await super.createProduct(clothingProd._id);
    if (!prod) {
      await ClothingModel.findByIdAndDelete(clothingProd._id);
      throw new BadRequest("An error occurs when creating clothing product!");
    }

    return prod;
  }
}

class Electronic extends Product {
  async createProduct() {
    const electronicProd = await ElectronicModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!electronicProd)
      throw new BadRequest("An error occurs when creating electronic product!");

    const prod = await super.createProduct(electronicProd._id);
    if (!prod) {
      await ElectronicModel.findByIdAndDelete(electronicProd._id);
      throw new BadRequest("An error occurs when creating electronic product!");
    }

    return prod;
  }
}

module.exports = ProductFactory;
