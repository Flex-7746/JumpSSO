const whitelist = ["/api/admin/v1/sign/login"];

module.exports = {
  routes: []
    .concat(
      // routes
      require("./v1"),
      require("./v2"),
    )
    .map((i) => ({ ...i, path: `/api/admin${i.path}` })),

  match: /^\/api\/admin/,

  auth: async (ctx) => {
    if (whitelist.includes(ctx.request.url)) {
      return true;
    }

    const token = ctx.request.header["x-token"];

    if (!token) {
      return false;
    }

    ctx.$user = await ctx.$cache(token);

    return !!ctx.$user;
  },
};
