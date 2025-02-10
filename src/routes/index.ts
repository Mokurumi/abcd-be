// routes index file
import express from "express";
import config from "../config";
import docsRoute from "./docs.routes";
import cron from "node-cron";

// Route
import authRoute from "./auth.routes";
import userRoute from "./user.routes";
import roleRoute from "./role.routes";
import uploadRoute from "./upload.routes";
// lookup routes
import lookupRoute from "./lookups.routes";

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

// // change to midday
// cron.schedule("0 12 * * *", async () => {
//   console.log("Midday Check");
// }, {
//   timezone: "Africa/Nairobi",
// });

export default router;
