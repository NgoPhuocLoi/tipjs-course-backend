const redis = require("redis");

class RedisPubSubService {
  constructor() {
    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();
    Promise.all([this.publisher.connect(), this.subscriber.connect()]).then(
      () => {
        console.log("Publisher and Subscriber are connected!");
      }
    );
  }

  async publish(channel, message) {
    return await this.publisher.publish(channel, message);
  }

  async subscribe(channel, cb) {
    // this.subscriber.on("mes")
    return await this.subscriber.subscribe(channel, (message) => {
      console.log(message);
      cb(message);
    });
  }
}

module.exports = new RedisPubSubService();
