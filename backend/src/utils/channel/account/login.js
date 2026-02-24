const { Op } = require("sequelize");

const lock = _require("utils/lock");

module.exports = async function login(opt) {
  try {
    const { ctx, username, password } = opt;

    const target = await ctx.$db.Config.findOne({
      where: { status: 1, key: "account_config" },
      attributes: ["key", "value"],
    });

    if (target) {
      const config = JSON.parse(target.value);
      if (!config.open) {
        throw { message: "没有启用钉钉登录" };
      }
    }

    const [error, result] = await lock.check({
      ctx,
      key: `sso-sign-${username}`,
      maxCount: 5,
      lockTimeout: 300,
      match: () =>
        ctx.$db.User.findOne({
          where: { status: 1, password, [Op.or]: { email: username, phone: username } },
          attributes: ["id", "openid", "email", "phone", "name", "nickname", "picture", "role", "create_date", "update_date"],
        }),
    });

    if (error) {
      if (typeof error === "string") {
        return [ctx.$err(400, `该账户已锁定，${error}`)];
      } else {
        return [ctx.$err(404, `登录失败，请检查账户名或密码${error < 3 ? `，还剩${error}次登录，失败后将锁定5分钟` : ""}`)];
      }
    }

    return [, result];
  } catch (e) {
    return [ctx.$err(500, e ? e.message || e.msg || JSON.stringify(e) : "error")];
  }
};
