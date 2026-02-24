const path = require("path");
const Koa = require("koa");

global._require = (v) => require(path.join(__dirname, v));

async function before() {
  const crypto = _require("utils/crypto");
  const checkPath = _require("utils/checkPath");
  const { join, runtime, web, public } = _require("utils/path/dir");

  await checkPath.dir(runtime);
  await checkPath.dir(web);
  await checkPath.dir(public);

  await checkPath.file(join(runtime, "./config.json"), () => JSON.stringify({ initPass: crypto.rand(16) }));
}

async function run() {
  const config = _require("config");

  const pathWeb = _require("utils/path/web");

  const app = new Koa();

  app.proxy = true;

  await require("./helper")(app);

  await require("./middleware")(app);

  app.listen(config.port, () => {
    console.log(`服务已启动: ${pathWeb.host}`);
  });
}

(async () => {
  await before();
  await run();
})();
