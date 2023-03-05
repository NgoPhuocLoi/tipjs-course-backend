const ApiKeyService = require("../services/apikey.service");
const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
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

module.exports = {
  apiKey,
  permission,
};
