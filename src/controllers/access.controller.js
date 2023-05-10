const { CreatedResponse, OkResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  async signup(req, res, next) {
    new CreatedResponse({
      message: "Register OK",
      metadata: await AccessService.signup(req.body),
    }).send(res);
  }

  async login(req, res) {
    new OkResponse({
      message: "Login successfully",
      metadata: await AccessService.login(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  }
}

module.exports = new AccessController();
