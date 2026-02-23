const { Op } = require("sequelize");

const crypto = _require("utils/crypto");

module.exports = [
  {
    method: "get",
    path: "/user/list",
    handler: async ({ ctx, query }) => {
      const key = ["pageIndex", "pageSize"].find((i) => query[i] === undefined);
      if (key) {
        return ctx.$err(400, key + " 缺失");
      }

      const pageIndex = Number(query.pageIndex);
      const pageSize = Number(query.pageSize);

      const where = { status: 1 };

      query.channel !== undefined && (where.channel = query.channel);

      if (query.keywork !== undefined) {
        where[Op.or] = {
          email: { [Op.like]: `%${query.keywork}%` },
          phone: { [Op.like]: `%${query.keywork}%` },
          name: { [Op.like]: `%${query.keywork}%` },
          nickname: { [Op.like]: `%${query.keywork}%` },
        };
      }

      const order = ["create_date", "DESC"];

      if (query.orderBy && query.orderType) {
        order[0] = query.orderBy;
        order[1] = query.orderType;
      }

      return ctx.$ok({
        pageIndex,
        pageSize,
        total: await ctx.$db.User.count({ where }),
        data: await ctx.$db.User.findAll({
          where,
          limit: pageSize,
          offset: (pageIndex - 1) * pageSize,
          order: [order],
          attributes: ["id", "channel", "openid", "email", "phone", "name", "nickname", "picture", "role", "create_date", "update_date"],
        }),
      });
    },
  },
  {
    method: "post",
    path: "/user/add",
    handler: async ({ ctx, body }) => {
      const key = ["email", "phone", "name", "role", "password"].find((i) => body[i] === undefined);
      if (key) {
        return ctx.$err(400, key + " 缺失");
      }

      if (![0, 2].includes(ctx.$user.role)) {
        return ctx.$err(400, "您无法新增用户");
      }

      if (ctx.$user.role === 2 && body.role !== 1) {
        return ctx.$err(400, "您只能创建普通用户");
      }

      const userInfo = await ctx.$db.User.create({
        channel: 1,
        openid: crypto.uuid(),
        email: body.email,
        phone: body.phone,
        name: body.name,
        nickname: body.nickname,
        picture: body.picture,
        password: body.password,
        role: body.role,
      });

      return ctx.$ok(userInfo.toJSON());
    },
  },
  {
    method: "put",
    path: "/user/update",
    handler: async ({ ctx, body }) => {
      if (!body.id) {
        return ctx.$err(400, "id 缺失");
      }

      if (![0, 2].includes(ctx.$user.role)) {
        return ctx.$err(400, "您无法编辑用户");
      }

      const target = await ctx.$db.User.findOne({ where: { status: 1, id: body.id }, attributes: ["id", "channel", "role"] });
      if (!target) {
        return ctx.$err(404, "目标用户不存在");
      }

      if (ctx.$user.role === 2) {
        if (target.role !== 1) {
          return ctx.$err(400, "您只能编辑普通用户");
        }

        if (body.role !== undefined && body.role !== 1) {
          return ctx.$err(400, "您不能修改用户身份");
        }
      }

      if (target.role === 0 && body.role !== undefined && body.role !== 0) {
        return ctx.$err(400, "您不能修改超级管理员的用户身份");
      }

      const update = {};

      body.email !== undefined && (update.email = body.email);
      body.phone !== undefined && (update.phone = body.phone);
      body.name !== undefined && (update.name = body.name);
      body.nickname !== undefined && (update.nickname = body.nickname);
      body.picture !== undefined && (update.picture = body.picture);

      if (target.channel === 1) {
        body.password !== undefined && (update.password = body.password);
        body.role !== undefined && (update.role = body.role);
      }

      await ctx.$db.User.update(update, { where: { id: body.id } });

      return ctx.$ok();
    },
  },
  {
    method: "delete",
    path: "/user/delete",
    handler: async ({ ctx, query }) => {
      if (!query.id) {
        return ctx.$err(400, "id 缺失");
      }

      const id = Number(query.id);

      if (id === ctx.$user.id) {
        return ctx.$err(400, "您无法删除自己");
      }

      if (![0, 2].includes(ctx.$user.role)) {
        return ctx.$err(400, "您无法删除用户");
      }

      const target = await ctx.$db.User.findOne({ where: { status: 1, id }, attributes: ["id", "role"] });
      if (!target) {
        return ctx.$err(404, "目标用户不存在");
      }

      if (ctx.$user.role === 2 && target.role !== 1) {
        return ctx.$err(400, "您只能删除普通用户");
      }

      await ctx.$db.User.update({ status: 0 }, { where: { id } });

      return ctx.$ok();
    },
  },
];
