const cors = require("@koa/cors");

module.exports = async function install(app) {
  app.use(cors());
};
