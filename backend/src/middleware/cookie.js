const config = _require("config");

const crypto = _require("utils/crypto");

module.exports = async function install(app) {
  const { name, key, expire } = config.cookie;

  app.use(async (ctx, next) => {
    const code = await ctx.cookies.get(name);

    if (code) {
      const val = crypto.deSign(code, key);
      if (val !== false) {
        ctx.$cookieID = val;
      }
    }

    if (ctx.$cookieID) {
      await ctx.cookies.set(name, code, { maxAge: expire * 1000, httpOnly: true });
    } else {
      const userID = crypto.uuid();
      await ctx.cookies.set(name, crypto.genSign(userID, key), { maxAge: expire * 1000, httpOnly: true });
      ctx.$cookieID = userID;
    }

    await next();
  });
};
