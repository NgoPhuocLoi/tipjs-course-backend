const Shop = require("../models/shop.model");

class ShopService {
  static async findByEmail({
    email,
    select = { email: 1, password: 1, name: 1, status: 1, roles: 1 },
  }) {
    return await Shop.findOne({ email }).select(select).lean();
  }
}

module.exports = ShopService;
