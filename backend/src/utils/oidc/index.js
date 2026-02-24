const mount = require("koa-mount");
const { Provider } = require("oidc-provider");

const config = require("./config");

const pathServer = _require("utils/path/server");

module.exports = function install(app) {
  const oidc = new Provider(pathServer.host + pathServer.oidcBase, config);

  app.use(async (ctx, next) => {
    ctx.$oidc = oidc;

    await next();
  });

  app.use(mount(pathServer.oidcBase, oidc));
};
