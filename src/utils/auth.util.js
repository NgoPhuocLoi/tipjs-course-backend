const jwt = require("jsonwebtoken");

const generateTokensPair = async (payload, privateKey, publicKey) => {
  try {
    const accessToken = await jwt.sign(payload, publicKey, {
      expiresIn: "2d",
    });

    const refreshToken = await jwt.sign(payload, privateKey, {
      expiresIn: "7d",
    });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.log("Error when generating tokens:: ", error);
  }
};

module.exports = {
  generateTokensPair,
};
