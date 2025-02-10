const config = require("../config");

const swaggerDef = {
  openapi: "3.0.0",
  info: {
    title: "ABCD API Documentation",
    version: config.version,
    description: "API documentation for ABCD",
    // license: {
    //   name: "ABCD",
    //   url: "https://www.abcd.com",
    // },
  },
  servers: [
    {
      url: config.api_url[config.env],
    },
  ],
};

module.exports = swaggerDef;
