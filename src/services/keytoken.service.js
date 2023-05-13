const KeyToken = require("../models/keytoken.model");

class KeyTokenService {
  static async createKeyToken({ shop, publicKey, privateKey, refreshToken }) {
    try {
      // const token = await KeyToken.create({
      //   shop,
      //   publicKey,
      //   privateKey,
      // });
      console.log({ refreshToken });
      const filter = { shop },
        update = {
          publicKey,
          privateKey,
          refreshTokensUsed: [],
          refreshToken,
        },
        options = {
          upsert: true,
          new: true,
        };
      const tokens = await KeyToken.findOneAndUpdate(filter, update, options);

      return tokens ? token.publicKey : null;
    } catch (error) {
      return error;
    }
  }

  static async findByShopId(shopId) {
    return await KeyToken.findOne({ shop: shopId }).lean();
  }

  static async deleteKeyById(keyId) {
    return await KeyToken.remove({ _id: keyId });
  }
}

module.exports = KeyTokenService;
