const { Op } = require("sequelize");

const crypto = _require("utils/crypto");

module.exports = [
  {
    method: "get",
    path: "/entry/list",
    handler: async ({ ctx, query }) => {
      const key = ["pageIndex", "pageSize"].find((i) => query[i] === undefined);
      if (key) {
        return ctx.$err(400, key + " 缺失");
      }

      const pageIndex = Number(query.pageIndex);
      const pageSize = Number(query.pageSize);

      const where = { status: 1 };

      if (query.app !== undefined) {
        where.app_id = query.app;
      }
      if (query.name !== undefined) {
        where.name = { [Op.like]: `%${query.name}%` };
      }

      const order = ["create_date", "ASC"];

      if (query.orderBy && query.orderType) {
        order[0] = query.orderBy;
        order[1] = query.orderType;
      }

      return ctx.$ok({
        pageIndex,
        pageSize,
        total: await ctx.$db.Entry.count({ where }),
        data: await ctx.$db.Entry.findAll({
          where,
          limit: pageSize,
          offset: (pageIndex - 1) * pageSize,
          order: [order],
          attributes: ["id", "name", "url", "type", "client", "oidc_config", "saml_config", "create_date", "update_date", "app_id"],
          include: {
            model: ctx.$db.App,
            as: "appData",
            attributes: ["id", "name", "picture", "desc", "create_date", "update_date"],
          },
        }),
      });
    },
  },
  {
    method: "post",
    path: "/entry/add",
    handler: async ({ ctx, body }) => {
      const key = ["app_id", "name", "url", "type"].find((i) => body[i] === undefined);
      if (key) {
        return ctx.$err(400, key + " 缺失");
      }

      await ctx.$db.Entry.create({
        app_id: body.app_id,
        name: body.name,
        url: body.url,
        type: body.type,
        client: crypto.uuid(),
        oidc_config: body.oidc_config || "{}",
        saml_config: body.saml_config || "{}",
      });

      return ctx.$ok();
    },
  },
  {
    method: "put",
    path: "/entry/update",
    handler: async ({ ctx, body }) => {
      if (!body.id) {
        return ctx.$err(400, "id 缺失");
      }

      const update = {};

      body.name !== undefined && (update.name = body.name);
      body.url !== undefined && (update.url = body.url);
      body.type !== undefined && (update.type = body.type);
      body.oidc_config !== undefined && (update.oidc_config = body.oidc_config);
      body.saml_config !== undefined && (update.saml_config = body.saml_config);

      await ctx.$db.Entry.update(update, { where: { id: body.id } });

      return ctx.$ok();
    },
  },
  {
    method: "delete",
    path: "/entry/delete",
    handler: async ({ ctx, query }) => {
      if (!query.id) {
        return ctx.$err(400, "id 缺失");
      }

      await ctx.$db.Entry.update({ status: 0 }, { where: { id: query.id } });

      return ctx.$ok();
    },
  },
];
