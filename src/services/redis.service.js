const redis = require("redis");
const { inventoryRepo } = require("../models/repositories");

class RedisService {
  constructor() {
    this.redisClient = redis.createClient();
    this.redisClient
      .connect()
      .then(() => {
        console.log("Redis is connected!");
      })
      .catch((err) => {
        console.log("Error when connecting to Redis!. Error :: " + err);
      });
  }

  async acquireLock({ productId, quantity, cartId }) {
    const key = `key_v2023_${productId}`;
    const retryTimes = 10;
    const exprireTime = 3000;

    for (let i = 0; i < retryTimes; i++) {
      const result = await this.redisClient.setNX(key, exprireTime);

      if (result === 1) {
        const updateResult = await inventoryRepo.reservationProduct({
          productId,
          quantity,
          cartId,
        });
        if (!updateResult.modifiedCount) {
          return null;
        }
        await this.redisClient.pExpire(key, exprireTime);
        return key;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }
  }

  async releaseLock(key) {
    return await this.redisClient.del(key);
  }
}

module.exports = new RedisService();
