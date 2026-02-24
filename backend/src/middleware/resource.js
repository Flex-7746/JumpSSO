const koaStatic = require("koa-static");
const koaMount = require("koa-mount");

const { join, web, public, runtime } = _require("utils/path/dir");

module.exports = async function install(app) {
  app.use(koaStatic(web));

  app.use(koaStatic(public));

  app.use(koaMount("/upload", koaStatic(join(runtime, "./upload"))));
};
