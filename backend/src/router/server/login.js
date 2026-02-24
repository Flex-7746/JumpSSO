const { Op } = require("sequelize");

const channel = _require("utils/channel/const");
const login = _require("utils/login");
const utils = _require("utils/saml/utils");
const pathServer = _require("utils/path/server");

module.exports = [
  {
    method: "get",
    path: "/status",
    handler: async ({ ctx, query }) => {
      if (!query.key) {
        return ctx.$err(400, "参数缺失");
      }

      const info = await ctx.$cache(query.key);
      if (!info) {
        return ctx.$err(400, "无效的 key");
      }

      return ctx.$ok(info.user ? `${pathServer.loginCallback}?key=${query.key}` : "");
    },
  },
  {
    method: "get",
    path: "/info",
    handler: async ({ ctx, query }) => {
      if (!query.key) {
        return ctx.$err(400, "参数缺失");
      }

      const info = await ctx.$cache(query.key);
      if (!info) {
        return ctx.$err(400, "无效的 key");
      }

      const entry = await ctx.$db.Entry.findOne({
        where: { status: 1, client: info.client },
        attributes: ["name", "type"],
        include: {
          model: ctx.$db.App,
          as: "appData",
          attributes: ["name", "picture", "desc"],
        },
      });

      if (!entry) {
        return ctx.$err(404, "不存在的应用配置");
      }

      const value = await ctx.$db.Config.findAll({
        where: { status: 1, key: { [Op.in]: channel.map((i) => i.config) } },
        attributes: ["key", "value"],
      });

      return ctx.$ok({
        app: {
          name: entry.appData.name,
          picture: entry.appData.picture,
          desc: entry.appData.desc,
          entry: entry.name,
        },
        ...channel.reduce((obj, item) => {
          const key = item.config.replace("_config", "");

          try {
            const target = value.find((i) => i.key === item.config);

            if (target) {
              const config = JSON.parse(target.value);
              obj[key] = config ? item.view(config) : null;
            } else {
              obj[key] = null;
            }
          } catch {
            obj[key] = null;
          }

          return obj;
        }, {}),
      });
    },
  },
  {
    method: "post",
    path: "/login",
    handler: async ({ ctx, body }) => {
      const [err, value] = await login.sign(ctx, body);

      if (err) {
        return err;
      }

      value.info.user = value.user;

      await ctx.$cache(body.key, value.info);

      return ctx.$ok(`${pathServer.loginCallback}?key=${body.key}`);
    },
  },
  {
    method: "get",
    path: "/callback",
    handler: async ({ ctx, query }) => {
      if (!query.key) {
        return ctx.$err(400, "参数缺失");
      }

      const info = await ctx.$cache(query.key);
      if (!info) {
        return ctx.$err(400, "无效的 key");
      }

      await ctx.$cache(query.key, null);

      if (info.user) {
        await ctx.$cache(info.user.openid, info.user);
        await ctx.$session("openid", info.user.openid);

        if (info.type === "saml" && info.method === "post") {
          ctx.type = "text/html";
          ctx.body = utils.genPostForm({
            contextName: "SAMLRequest",
            entityEndpoint: info.callback,
            context: info.body.SAMLRequest,
            relayState: info.body.RelayState || info.body.relayState || "",
          });
        } else {
          await ctx.redirect(info.callback);
        }
      } else {
        await login.jump(ctx, info);
      }
    },
  },
];
