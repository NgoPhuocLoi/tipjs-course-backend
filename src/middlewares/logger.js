const Logger = require("../loggers/discord.log");

const sendLogToDiscord = async (req, res, next) => {
  try {
    const logData = {
      title: "Method: " + req.method,
      code: req.method === "GET" ? req.query : req.body,
      message: `${req.get("host")}${req.originalUrl}`,
    };
    Logger.sendFormatedCode(logData);
    return next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendLogToDiscord,
};
