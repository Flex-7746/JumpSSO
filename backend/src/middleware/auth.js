const admin = _require("router/admin");
const server = _require("router/server");

module.exports = async function install(app) {
  const config = [].concat(admin, server);

  app.use(async (ctx, next) => {
    const target = config.find((i) => i.match.test(ctx.request.url));

    if (target && target.auth && (await target.auth(ctx)) === false) {
      ctx.status = 401;
      ctx.body = ctx.$err(401, "未找到用户信息，请检查是否登录或登录是否过期");
      ctx.statusText = "OK";
      return;
    }

    await next();
  });
};
