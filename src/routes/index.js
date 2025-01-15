// routes index file
const express = require("express");
const config = require("../config/config");
const docsRoute = require("./docs.routes");
const cron = require("node-cron");


// Route
const authRoute = require("./auth.routes");
const userRoute = require("./user.routes");
const roleRoute = require("./role.routes");
const uploadRoute = require("./upload.routes");
// lookup routes
const lookupRoute = require("./lookups.routes");


const router = express.Router();

const defaultRoutes = [
  // common routes
  { path: "/auth", route: authRoute },
  { path: "/users", route: userRoute },
  { path: "/roles", route: roleRoute },
  { path: "/uploads", route: uploadRoute },
  // lookup routes
  { path: "/lookups", route: lookupRoute },
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

if (config.env === "dev" || config.env === "qa" || config.env === "local") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

router.get("/", (req, res) => {
  res.json({ message: "Error at the root of the API" });
});

// change to midday
cron.schedule("0 12 * * *", async () => {
  console.log("Midday Check");
}, {
  timezone: "Africa/Nairobi",
});

module.exports = router;
