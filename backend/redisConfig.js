const { createClient } = require("redis");

const redisClient = createClient({
  url: "redis://localhost:6379",
});

redisClient.on(
  "error",
  (
    err // eslint-disable-next-line no-console
  ) => console.log("Redis Client Error", err)
);

redisClient
  .connect()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Connected to Redis");
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.log("Redis connection failed", err);
  });

module.exports = {
  redisClient,
};
