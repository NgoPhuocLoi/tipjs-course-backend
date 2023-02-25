const mongoose = require("mongoose");
const { countConnection } = require("../helpers/checkConnectDb");

const dev = true;

class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    if (dev) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => {
        console.log("Mongodb is connected!");
        countConnection();
      })
      .catch((err) => {
        console.log("Error when connecting to MongoDB. Error: " + err);
      });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
