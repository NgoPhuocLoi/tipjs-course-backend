const accessController = require("../../controllers/access.controller");

const router = require("express").Router();

router.post("/shop/signup", accessController.signup);

module.exports = router;
