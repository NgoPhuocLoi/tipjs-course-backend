const { CreatedResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  async signup(req, res, next) {
    new CreatedResponse({
      message: "Register OK",
      metadata: await AccessService.signup(req.body),
    }).send(res);
  }
}

module.exports = new AccessController();
