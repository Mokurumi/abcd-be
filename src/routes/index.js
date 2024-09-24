// routes index file
const express = require("express");
const config = require("../config/config");
const docsRoute = require("./docs.route");
// const cron = require("node-cron");


// Route
const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const roleRoute = require("./role.route");
const permission = require("./permission.route");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/roles",
    route: roleRoute,
  },
  {
    path: "/permissions",
    route: permission,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: "/swagger/index.html",
    route: docsRoute,
  },
];


defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

if (config.env === "dev") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

router.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

module.exports = router;
