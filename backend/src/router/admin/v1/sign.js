const { Op } = require("sequelize");

const crypto = _require("utils/crypto");
const lock = _require("utils/lock");

module.exports = [
  {
    method: "post",
    path: "/sign/login",
    handler: async ({ ctx, body }) => {
      const key = ["username", "password"].find((i) => body[i] === undefined);
      if (key) {
        return ctx.$err(400, key + " 缺失");
      }

      const [error, user] = await lock.check({
        ctx,
        key: `admin-sign-${body.username}`,
        maxCount: 5,
        lockTimeout: 300,
        match: () =>
          ctx.$db.User.findOne({
            where: { status: 1, channel: 1, role: [0, 2], password: body.password, [Op.or]: { email: body.username, phone: body.username } },
            attributes: ["id", "channel", "openid", "email", "phone", "name", "nickname", "picture", "role", "create_date", "update_date"],
          }),
      });

      if (error) {
        if (typeof error === "string") {
          return ctx.$err(400, `该账户已锁定，${error}`);
        } else {
          return ctx.$err(404, `登录失败，请检查账户名或密码${error < 3 ? `，还剩${error}次登录，失败后将锁定5分钟` : ""}`);
        }
      }

      const value = user.toJSON();
      value.token = crypto.uuid();

      await ctx.$cache(value.token, value);

      return ctx.$ok({ token: value.token });
    },
  },
  {
    method: "get",
    path: "/sign/info",
    handler: async ({ ctx }) => {
      return ctx.$ok(ctx.$user);
    },
  },
  {
    method: "post",
    path: "/sign/logout",
    handler: async ({ ctx }) => {
      await ctx.$cache(ctx.$user.token, null);

      return ctx.$ok();
    },
  },
];
