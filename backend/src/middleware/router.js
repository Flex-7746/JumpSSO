const { Router } = require("@koa/router");
const mime = require("mime-types");

const admin = _require("router/admin");
const server = _require("router/server");

module.exports = async function install(app) {
  const router = new Router();

  const routes = [].concat(admin.routes, server.routes);

  routes.forEach(({ method, path, handler }) => {
    router[method](path, async (ctx) => {
      try {
        const result = await handler({
          app,
          ctx,
          query: ctx.query || {},
          body: ctx.request.body || {},
          params: ctx.params || {},
          files: ctx.request.files || {},
        });

        if (result) {
          if (result.code === 200 && result.file) {
            ctx.set("Content-Type", mime.lookup(result.file.path) || "application/octet-stream");
            ctx.set("Content-Length", result.file.size);
            ctx.body = result.file.data;
          } else {
            ctx.body = result;
          }

          ctx.status = 200;
          ctx.statusText = "OK";
        }
      } catch (e) {
        console.log(e);
        ctx.body = ctx.$err(500, e);

        ctx.status = 200;
        ctx.statusText = "OK";
      }
    });
  });

  app.use(router.routes());

  app.use(router.allowedMethods());
};
