const fs = require("fs").promises;

const { join, web } = _require("utils/path/dir");
const checkPath = _require("utils/checkPath");

const include = [/^\/api\/admin/, /^\/server/, /^\/oidc/];

module.exports = async function install(app) {
  const filePath = await checkPath.file(join(await checkPath.dir(web), "index.html"), () => "404");

  app.use(async (ctx, next) => {
    if (include.some((i) => ctx.request.url.match(i))) {
      await next();
      return;
    }

    try {
      const stat = await fs.stat(filePath);

      if (stat.isFile()) {
        ctx.type = "text/html; charset=utf-8";
        ctx.body = await fs.readFile(filePath);
        return;
      }
    } catch {
      ctx.body = "404";
    }
  });
};
