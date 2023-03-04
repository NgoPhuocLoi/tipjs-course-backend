const KeyToken = require("../models/keytoken.model");

class KeyTokenService {
  static async createKeyToken({ shop, publicKey, privateKey }) {
    try {
      const token = await KeyToken.create({
        shop,
        publicKey,
        privateKey,
      });

      return token ? token.publicKey : null;
    } catch (error) {
      return error;
    }
  }
}

module.exports = KeyTokenService;
