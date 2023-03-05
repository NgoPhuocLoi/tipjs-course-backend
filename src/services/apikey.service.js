const ApiKey = require("../models/apikey.model");

class ApiKeyService {
  static async findById(key) {
    try {
      const keyObj = await ApiKey.findOne({ key, status: true }).lean();
      return keyObj;
    } catch (error) {
      console.log("Error when finding ApiKey");
      return null;
    }
  }
}

module.exports = ApiKeyService;
