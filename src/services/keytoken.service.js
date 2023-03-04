const KeyToken = require("../models/keytoken.model");

class KeyTokenService {
  static async createKeyToken({ shop, publicKey }) {
    try {
      const publicKeyString = publicKey.toString();
      console.log({ publicKeyString });
      const token = await KeyToken.create({
        shop,
        publicKey: publicKeyString,
      });

      return token ? publicKeyString : null;
    } catch (error) {
      return error;
    }
  }
}

module.exports = KeyTokenService;
