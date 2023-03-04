const AccessService = require("../services/access.service");

class AccessController {
  async signup(req, res, next) {
    try {
      console.log("[P]::signup:: ", req.body);

      res.status(201).json(await AccessService.signup(req.body));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AccessController();
