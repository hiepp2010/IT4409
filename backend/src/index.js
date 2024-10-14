const express = require("express");

const router = express.Router();
const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
];

_.forEach(defaultRoutes, (route) => {
  router.use(route.path, route.route);
});

module.exports = router;
