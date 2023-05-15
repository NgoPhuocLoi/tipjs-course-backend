const jwt = require("jsonwebtoken");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const ApiKeyService = require("../services/apikey.service");
const KeyTokenService = require("../services/keytoken.service");
const { asyncHandler } = require("../helpers/handleError");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
  SHOP_ID: "x-client-id",
  REFRESH_TOKEN: "x-refresh-token",
};

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();

    if (!key)
      return res.status(403).json({
        message: "Forbidden Error",
      });

    const keyObj = await ApiKeyService.findById(key);

    if (!keyObj)
      return res.status(403).json({
        message: "Forbidden Error",
      });
    req.keyObj = keyObj;
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Error when checking ApiKey",
    });
  }
};

const permission = (permission) => (req, res, next) => {
  if (!req.keyObj.permissions)
    return res.status(403).json({
      message: "Permission Denied",
    });
  console.log("permissions:: ", req.keyObj.permissions);
  const validPermission = req.keyObj.permissions.includes(permission);

  if (!validPermission)
    return res.status(403).json({
      message: "Permission Denied",
    });

  next();
};

const authentication = asyncHandler(async (req, res, next) => {
  // 1. Check if req has shopId or not
  const shopId = req.headers[HEADER.SHOP_ID];
  if (!shopId) throw new AuthFailureError("Invalid Request");

  // 2. Find shop's publicKey in DB by shopId
  const keyStore = await KeyTokenService.findByShopId(shopId);
  if (!keyStore) throw new NotFoundError("Key not found!");
  console.log("refreshToken:: ", req.headers[HEADER.REFRESH_TOKEN]);
  // Added: check if headers has field: 'x-refresh-token' => accessToken expired, using refreshToken to generate new tokenPair
  if (req.headers[HEADER.REFRESH_TOKEN]) {
    const refreshToken = req.headers[HEADER.REFRESH_TOKEN];

    // decode refreshToken by using privateKey
    const decoded = await jwt.verify(refreshToken, keyStore.privateKey);

    if (shopId !== decoded.shop) throw new AuthFailureError("Invalid ShopId");

    req.keyStore = keyStore;
    req.refreshToken = refreshToken;
    req.shop = decoded;
    return next();
  }

  // 3. Get token from req
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid Request");

  // 4. Verify token (decode accessToken by using pubicKey)
  const decoded = jwt.verify(accessToken, keyStore.publicKey);

  if (shopId !== decoded.shop) throw new AuthFailureError("Invalid ShopId");

  req.keyStore = keyStore;
  req.shop = decoded;

  return next();
});

module.exports = {
  apiKey,
  permission,
  authentication,
};
