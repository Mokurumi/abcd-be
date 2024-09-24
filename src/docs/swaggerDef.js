const config = require("../config/config");

const swaggerDef = {
  openapi: "3.0.0",
  info: {
    title: "ABCD",
    version: config.version,
    description: "API documentation for ABCD",
    // license: {
    //   name: "ABCD",
    //   url: "https://www.abcd.com",
    // },
  },
  servers: [
    // local
    {
      url: `http://localhost:${config.port}`,
    },
    // dev
    // qa
    // prod
  ],
};

module.exports = swaggerDef;
