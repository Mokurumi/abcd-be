const config = require("../config/config");

const swaggerDef = {
  openapi: "3.0.0",
  info: {
    title: "ABCD API documentation",
    version: config.version,
    description: "API documentation for ABCD",
    // license: {
    //   name: "ABCD",
    //   url: "https://www.abcd.com",
    // },
  },
  servers: [
    // local, dev, qa, prod
    { url: config.api_url[config.env || 'local'], },
  ],
};

module.exports = swaggerDef;
