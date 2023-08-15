const {
  ProductModel,
  ClothingModel,
  ElectronicModel,
  FurnitureModel,
} = require("../models/product.model");
const { BadRequest } = require("../core/error.response");
const { productRepo, inventoryRepo } = require("../models/repositories");
const { updateNestedObjectParser } = require("../utils");

class ProductFactory {
  // this method need open and edit the code when adding new product type => violate the SOLID principle (open-closed)

  /*static async createProduct(type, payload) {
    switch (type) {
      case "Clothing":
        return await new Clothing(payload).createProduct();
      case "Electronic":
        return await new Electronic(payload).createProduct();
      default:
        throw new BadRequest("Invalid product's type!");
    }
  }*/

  // new createProduct method using strategy pattern
  static productRegistry = {};

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];

    if (!productClass) throw new BadRequest("Invalid product's type!");

    return await new productClass(payload).createProduct();
  }

  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) throw new BadRequest("Invalid product's type!");
    return await new productClass(payload).updateProduct(productId);
  }

  // ========== QUERY ============= //

  static async findAllDraftsForShop({ shopId, limit = 50, skip = 0 }) {
    return await productRepo.findAllDraftsForShop({ shopId, limit, skip });
  }

  static async findAllPublishedForShop({ shopId, limit = 50, skip = 0 }) {
    return await productRepo.findAllPublishedForShop({ shopId, limit, skip });
  }

  static async searchProducts({ textSearch }) {
    return await productRepo.searchProductsByUser({ textSearch });
  }

  static async findAllProducts({
    filter = { isPublished: true },
    limit = 50,
    page = 1,
    sort = "ctime",
    select = ["product_name", "product_thumb", "product_price", "product_shop"],
  }) {
    return await productRepo.findAllProducts({
      filter,
      limit,
      page,
      sort,
      select,
    });
  }

  static async findOneProduct({ product_id, unselect = ["__v", "updatedAt"] }) {
    return productRepo.findOneProduct({ product_id, unselect });
  }

  //=================================//

  //========= PUT ==================//
  static async publishProductByShop({ shopId, productId }) {
    return await productRepo.publishProductByShop({ shopId, productId });
  }
  static async unPublishProductByShop({ shopId, productId }) {
    return await productRepo.unPublishProductByShop({ shopId, productId });
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
    product_ratingsAverage,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
    this.product_ratingsAverage = product_ratingsAverage;
  }

  async createProduct(productId) {
    const newProduct = await ProductModel.create({ ...this, _id: productId });

    if (newProduct) {
      await inventoryRepo.insertInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity,
      });
    }

    return newProduct;
  }

  async updateProduct(productId, payload) {
    return await productRepo.updateProductById({
      productId,
      payload,
      Model: ProductModel,
    });
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

  async updateProduct(productId) {
    const payload = updateNestedObjectParser(this);

    if (payload.product_attributes) {
      await productRepo.updateProductById({
        productId,
        payload,
        Model: ClothingModel,
      });
    }

    return await super.updateProduct(productId, payload);
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

  async updateProduct(productId) {
    console.log("[1]::: ", this);
    const payload = updateNestedObjectParser(this);
    console.log("[2]::: ", payload);
    if (payload.product_attributes) {
      await productRepo.updateProductById({
        productId,
        payload,
        Model: ElectronicModel,
      });
    }

    return await super.updateProduct(productId, payload);
  }
}

class Furniture extends Product {
  async createProduct() {
    const furnitureProd = await FurnitureModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!furnitureProd)
      throw new BadRequest("An error occurs when creating furniture product!");

    const prod = await super.createProduct(furnitureProd._id);
    if (!prod) {
      await FurnitureModel.findByIdAndDelete(furnitureProd._id);
      throw new BadRequest("An error occurs when creating furniture product!");
    }

    return prod;
  }
}

ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory;
