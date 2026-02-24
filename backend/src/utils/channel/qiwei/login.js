const getToken = require("./getToken");
const getUser = require("./getUser");

module.exports = async function login(opt) {
  const { ctx, code } = opt;

  try {
    if (!opt.code) {
      throw { message: "code 缺失" };
    }

    const target = await ctx.$db.Config.findOne({
      where: { status: 1, key: "qiwei_config" },
      attributes: ["key", "value"],
    });

    if (!target) {
      throw { message: "没有启用企微登录" };
    }

    const config = JSON.parse(target.value);
    if (!config.open) {
      throw { message: "没有启用企微登录" };
    }

    const [err1, access_token] = await getToken({ ctx, corpId: config?.corpId, appSecret: config?.appSecret });
    if (err1) {
      return [err1];
    }

    const [err2, user] = await getUser({ ctx, access_token, code });
    if (err2) {
      return [err2];
    }

    const attribute = (config.attribute || []).reduce((obj, item) => {
      obj[item.left] = item.right;
      return obj;
    }, {});

    const result = {
      openid: user.userid, // 唯一标识
      email: user[attribute.email || "email"],
      phone: user[attribute.phone || "mobile"],
      name: user[attribute.name || "name"],
      nickname: user[attribute.nickname || "alias"],
      picture: user[attribute.picture || "avatar"],
    };

    if (config.saveInfo) {
      const target = await ctx.$db.User.findOne({ where: { status: 1, channel: 4, openid: result.openid }, attributes: ["id"] });

      if (target) {
        result.email = result.email || target.email;
        result.phone = result.phone || target.phone;
        result.name = result.name || target.name;
        result.nickname = result.nickname || target.nickname;
        result.picture = result.picture || target.picture;

        await ctx.$db.User.update(result, { where: { id: target.id } });
      } else {
        await ctx.$db.User.create({ channel: 4, password: "", role: 1, ...result });
      }
    }

    return [, result];
  } catch (e) {
    return [ctx.$err(500, e ? e.message || e.msg || JSON.stringify(e) : "error")];
  }
};
