const mongoose = require("mongoose");
const os = require("os");
const process = require("process");

const SECONDS_PER_MONITOR = 5000;
const CONNECTION_PER_CORE = 5;

const countConnection = () => {
  const numConnections = mongoose.connections.length;
  console.log(`Number of connections: ${numConnections}`);
};

const checkOverloadConnection = () => {
  setInterval(() => {
    const numConnections = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    const maxConnections = numCores * CONNECTION_PER_CORE;

    console.log(`Active connections: ${numConnections}`);
    console.log(`Memory usage: ${memoryUsage / 2 ** 20} Mb`);

    if (numConnections > maxConnections) {
      console.log("Connection Overload Detected!");
    }
  }, SECONDS_PER_MONITOR); // monitor every 5s
};

module.exports = { countConnection, checkOverloadConnection };
