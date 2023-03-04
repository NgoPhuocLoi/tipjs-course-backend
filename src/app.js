require("dotenv").config();
const compression = require("compression");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
// const { checkOverloadConnection } = require("./helpers/checkConnectDb");
const router = require("./routes");

const app = express();

// init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// init db
require("./dbs/mongodb.init");
// checkOverloadConnection();
// init routes
app.use("/", router);
// handling errors

module.exports = app;
