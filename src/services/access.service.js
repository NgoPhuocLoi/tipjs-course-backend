const { generateKeyPairSync, createPublicKey } = require("crypto");
const bcrypt = require("bcrypt");
const Shop = require("../models/shop.model");
const KeyTokenService = require("./keytoken.service");
const { generateTokensPair } = require("../utils/auth.util");
const { getInfoData } = require("../utils");

const SHOP_ROLES = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
};

class AccessService {
  static async signup({ name, email, password }) {
    try {
      // check the shop existed ?
      const holderShop = await Shop.findOne({ email }).lean();
      console.log({ holderShop });
      if (holderShop)
        return {
          code: "xxxx",
          message: "Shop have already existed",
          status: "error",
        };
      // create a new shop
      const hashedPassword = await bcrypt.hash(password, 10);

      const newShop = await Shop.create({
        name,
        email,
        password: hashedPassword,
        roles: [SHOP_ROLES.SHOP],
      });

      if (!newShop) {
        return {
          code: 400,
          metadata: null,
        };
      }

      // generate privatekey and publickey
      const { privateKey, publicKey } = generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: "pkcs1",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs1",
          format: "pem",
        },
      });

      console.log({ privateKey, publicKey });
      // publickey will be convert to string and be stored in collection 'Keys'
      const publicKeyString = await KeyTokenService.createKeyToken({
        shop: newShop._id,
        publicKey,
      });

      if (!publicKeyString)
        return {
          code: "xxx",
          message: "publicKeyString Error",
        };

      // reconvert publickey string to publickey object
      const publicKeyObj = createPublicKey(publicKeyString);
      console.log("publicKeyPbj::: ", publicKeyObj);
      const tokens = await generateTokensPair(
        { shop: newShop._id, email },
        privateKey,
        publicKeyObj
      );

      console.log("Tokens are created:: ", tokens);

      return {
        code: 201,
        metadata: {
          shop: getInfoData(newShop, ["name", "_id", "email"]),
          tokens,
        },
      };
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  }
}

module.exports = AccessService;
