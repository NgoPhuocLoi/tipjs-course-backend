const crypto = require("crypto");
const bcrypt = require("bcrypt");
const Shop = require("../models/shop.model");
const KeyTokenService = require("./keytoken.service");
const { generateTokensPair } = require("../utils/auth.util");
const { getInfoData } = require("../utils");
const { BadRequest } = require("../core/error.response");

const SHOP_ROLES = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
};

class AccessService {
  static async signup({ name, email, password }) {
    const holderShop = await Shop.findOne({ email }).lean();
    if (holderShop) throw new BadRequest("Shop have already existed");
    // create a new shop
    const hashedPassword = await bcrypt.hash(password, 10);

    const newShop = await Shop.create({
      name,
      email,
      password: hashedPassword,
      roles: [SHOP_ROLES.SHOP],
    });

    // generate privatekey and publickey
    // const { privateKey, publicKey } = generateKeyPairSync("rsa", {
    //   modulusLength: 4096,
    //   publicKeyEncoding: {
    //     type: "pkcs1",
    //     format: "pem",
    //   },
    //   privateKeyEncoding: {
    //     type: "pkcs1",
    //     format: "pem",
    //   },
    // });

    // simpler way to generate private key and public key
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    console.log({ privateKey, publicKey });
    // publickey will be convert to string and be stored in collection 'Keys'
    const keyStore = await KeyTokenService.createKeyToken({
      shop: newShop._id,
      publicKey,
      privateKey,
    });

    if (!keyStore) throw new Error("KeyStore Error");

    // reconvert publickey string to publickey object
    // const publicKeyObj = createPublicKey(publicKeyString);
    // console.log("publicKeyPbj::: ", publicKeyObj);
    const tokens = await generateTokensPair(
      { shop: newShop._id, email },
      privateKey,
      publicKey
    );

    console.log("Tokens are created:: ", tokens);

    return {
      shop: getInfoData(newShop, ["name", "_id", "email"]),
      tokens,
    };
  }
}

module.exports = AccessService;
