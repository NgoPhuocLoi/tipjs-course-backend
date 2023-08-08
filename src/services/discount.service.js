const { BadRequest, NotFoundError } = require("../core/error.response");
const DiscountModel = require("../models/discount.model");
const { updateNestedObjectParser } = require("../utils");
const { productRepo, discountRepo } = require("../models/repositories");

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      name,
      description,
      type,
      value,
      code,
      startDate,
      endDate,
      maxUses,
      usesCount,
      maxUsesPerUser,
      minOrderValue,
      shopId,
      isActive,
      appliesTo,
      productIds,
    } = payload;

    if (new Date(startDate) < new Date())
      throw new BadRequest("Invalid start date");

    if (new Date(startDate) > new Date(endDate))
      throw new BadRequest("Start date must greater than end date!");

    const foundDiscount = await discountRepo.checkDiscountExisted({
      discount_code: code,
      discount_shopId: shopId,
    });

    if (foundDiscount && foundDiscount.discount_isActive)
      throw new BadRequest("Discount has existed!");

    const discount = await DiscountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_startDate: new Date(startDate),
      discount_endDate: new Date(endDate),
      discount_maxUses: maxUses,
      discount_usesCount: usesCount,
      discount_maxUsesPerUser: maxUsesPerUser,
      discount_minOrderValue: minOrderValue,
      discount_shopId: shopId,
      discount_isActive: isActive,
      discount_appliesTo: appliesTo,
      discount_productIds: appliesTo === "all" ? [] : productIds,
    });

    return { discount };
  }

  static async updateDiscountCode(code, payload) {
    const updatedDiscount = await DiscountModel.findOneAndUpdate(
      {
        discount_code: code,
      },
      updateNestedObjectParser(payload),
      { new: true }
    );

    if (!updatedDiscount) throw new NotFoundError("Discount code not found!");
    return { discount: updatedDiscount };
  }

  static async getAllProductsByDiscountCode({ shopId, code, page, limit }) {
    const foundDiscount = await discountRepo.checkDiscountExisted({
      discount_code: code,
      discount_shopId: shopId,
    });

    if (!foundDiscount) throw new NotFoundError("Discount has not existed!");

    let productFilter;

    if (foundDiscount.discount_appliesTo === "all") {
      productFilter = {
        product_shop: shopId,
        isPublished: true,
      };
    }

    if (foundDiscount.discount_appliesTo === "specific") {
      productFilter = {
        _id: { $in: foundDiscount.discount_productIds },
        product_shop: shopId,
        isPublished: true,
      };
    }

    const products = await productRepo.findAllProducts({
      filter: productFilter,
      limit: +limit,
      page: +page,
      sortBy: "ctime",
      select: ["product_name"],
    });

    return { products };
  }

  static async getAllDiscountCodesByShop({ shopId, limit, page, sortBy }) {
    const discounts = await discountRepo.findAllDiscountsUnselect({
      filter: {
        discount_shopId: shopId,
        discount_isActive: true,
      },
      limit,
      page,
      sortBy,
      unselect: ["__v", "discount_shopId"],
    });

    return { discounts };
  }

  static async getDiscountAmount({ code, shopId, userId, products }) {
    const foundDiscount = await discountRepo.checkDiscountExisted({
      discount_code: code,
      discount_shopId: shopId,
    });

    if (!foundDiscount)
      throw new NotFoundError(`Discount with code "${code}" not found!`);

    const {
      discount_startDate,
      discount_endDate,
      discount_type,
      discount_maxUses,
      discount_maxUsesPerUser,
      discount_minOrderValue,
      discount_value,
    } = foundDiscount;
    if (
      new Date() < new Date(discount_startDate) ||
      new Date() > new Date(discount_endDate)
    )
      throw new BadRequest("Discount code is expired!");

    if (discount_maxUses === 0)
      throw new BadRequest("Discount code has been used up!");

    if (discount_maxUsesPerUser > 0) {
      // handle later
    }

    const totalAmount = products.reduce(
      (acc, product) => acc + product.product_quantity * product.product_price,
      0
    );

    if (discount_minOrderValue && totalAmount < discount_minOrderValue)
      throw new BadRequest(
        "The min order value must be " + discount_minOrderValue
      );

    const discountAmount =
      discount_type === "fixed_amount"
        ? discount_value
        : (totalAmount * discount_value) / 100;

    return {
      totalAmount,
      discountAmount,
      remainAmount:
        totalAmount - discountAmount > 0 ? totalAmount - discountAmount : 0,
    };
  }

  static async deleteDiscountCode({ code, shopId }) {
    const deleted = await DiscountModel.findOneAndDelete({
      discount_code: code,
      discount_shopId: shopId,
    });

    return {
      deleted,
    };
  }

  static async cancelDiscountCode({ code, shopId, userId }) {
    const foundDiscount = await discountRepo.checkDiscountExisted({
      discount_code: code,
      discount_shopId: shopId,
    });

    if (!foundDiscount) throw new NotFoundError("Discount code not found!");

    const updated = await DiscountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_usersUsed: userId,
      },
      $inc: {
        discount_maxUses: 1,
        discount_usesCount: -1,
      },
    });

    return {
      discount: updated,
    };
  }
}

module.exports = DiscountService;
