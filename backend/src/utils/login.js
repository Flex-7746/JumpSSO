const crypto = _require("utils/crypto");
const pathWeb = _require("utils/path/web");
const channel = _require("utils/channel/const");

module.exports = {
  auth: async (ctx) => {
    const openid = await ctx.$session("openid");

    if (openid) {
      const user = await ctx.$cache(openid);

      if (user) {
        return [, user];
      } else {
        await ctx.$session("openid", null);
      }
    }

    return [ctx.$err(401, "未登录")];
  },

  jump: async (ctx, info) => {
    const key = crypto.uuid();
    await ctx.$cache(key, info, { expire: 300 });
    await ctx.redirect(pathWeb.login(key));
  },

  sign: async (ctx, body) => {
    const info = await ctx.$cache(body.key);
    if (!info) {
      return [ctx.$err(400, "无效的 key")];
    }

    const target = channel.find((i) => Number(i.value) === Number(body.type));
    if (target) {
      const [error, user] = await target.login({ ctx, ...body });
      return error ? [ctx.$err(400, error)] : [, { info, user }];
    }

    return [ctx.$err(400, "type 参数不正确")];
  },
};
