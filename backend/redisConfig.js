const { createClient } = require("redis");

const redisClient = createClient({
  url: "redis://localhost:6379",
});

let isRedisConnected = false;
let hasShownError = false;

redisClient.on("error", () => {
  if (!hasShownError) {
    // eslint-disable-next-line no-console
    console.log("Unable to connect to Redis");
    hasShownError = true;
  }
});

redisClient
  .connect()
  .then(() => {
    isRedisConnected = true;
    // eslint-disable-next-line no-console
    console.log("Connected to Redis");
  })
  .catch(() => {
    // eslint-disable-next-line no-console
    console.log("Redis connection failed, continuing without Redis.");
    isRedisConnected = false; // Đặt cờ nếu không kết nối được Redis
  });

module.exports = {
  redisClient,
  isRedisConnected,
};
