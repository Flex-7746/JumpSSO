const { Op } = require("sequelize");

module.exports = [
  {
    method: "get",
    path: "/app/list",
    handler: async ({ ctx, query }) => {
      const key = ["pageIndex", "pageSize"].find((i) => query[i] === undefined);
      if (key) {
        return ctx.$err(400, key + " 缺失");
      }

      const pageIndex = Number(query.pageIndex);
      const pageSize = Number(query.pageSize);

      const where = { status: 1 };

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
        total: await ctx.$db.App.count({ where }),
        data: await ctx.$db.App.findAll({
          where,
          limit: pageSize,
          offset: (pageIndex - 1) * pageSize,
          order: [order],
          attributes: ["id", "name", "picture", "desc", "create_date", "update_date"],
          include: {
            model: ctx.$db.Entry,
            as: "entryData",
            required: false,
            where: { status: 1 },
            attributes: ["id", "name", "url", "type", "client", "oidc_config", "saml_config", "create_date", "update_date", "app_id"],
          },
        }),
      });
    },
  },
  {
    method: "get",
    path: "/app/list/simplify",
    handler: async ({ ctx }) => {
      const where = { status: 1 };
      const order = ["create_date", "ASC"];

      return ctx.$ok(
        await ctx.$db.App.findAll({
          where,
          order: [order],
          attributes: ["id", "name"],
          include: {
            model: ctx.$db.Entry,
            as: "entryData",
            required: false,
            where,
            order: [order],
            attributes: ["client", "name"],
          },
        }),
      );
    },
  },
  {
    method: "post",
    path: "/app/add",
    handler: async ({ ctx, body }) => {
      const key = ["name", "picture"].find((i) => body[i] === undefined);
      if (key) {
        return ctx.$err(400, key + " 缺失");
      }

      await ctx.$db.App.create({ name: body.name, picture: body.picture, desc: body.desc });

      return ctx.$ok();
    },
  },
  {
    method: "put",
    path: "/app/update",
    handler: async ({ ctx, body }) => {
      if (!body.id) {
        return ctx.$err(400, "id 缺失");
      }

      const update = {};

      body.name !== undefined && (update.name = body.name);
      body.picture !== undefined && (update.picture = body.picture);
      body.desc !== undefined && (update.desc = body.desc);

      await ctx.$db.App.update(update, { where: { id: body.id } });

      return ctx.$ok();
    },
  },
  {
    method: "delete",
    path: "/app/delete",
    handler: async ({ ctx, query }) => {
      if (!query.id) {
        return ctx.$err(400, "id 缺失");
      }

      await ctx.$db.App.update({ status: 0 }, { where: { id: query.id } });
      await ctx.$db.Entry.update({ status: 0 }, { where: { app_id: query.id } });

      return ctx.$ok();
    },
  },
];
