require("dotenv").config();
const compression = require("compression");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const { checkOverloadConnection } = require("./helpers/checkConnectDb");

const app = express();

// init middleware
app.use(morgan("combined"));
app.use(helmet());
app.use(compression());

// init db
require("./dbs/mongodb.init");
checkOverloadConnection();
// init routes
app.get("/", (req, res) => {
  const str = "helo hello";
  res.json({
    message: str.repeat(100000),
  });
});

// handling errors

module.exports = app;
