// routes index file
const express = require("express");
// const cron = require("node-cron");

// const config = require("../../config/config");


const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

module.exports = router;
