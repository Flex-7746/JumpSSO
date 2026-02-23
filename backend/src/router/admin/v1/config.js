const { Op } = require("sequelize");

module.exports = [
  {
    method: "get",
    path: "/config/get",
    handler: async ({ ctx, query }) => {
      const key = ["keys"].find((i) => query[i] === undefined);
      if (key) {
        return ctx.$err(400, key + " 缺失");
      }

      const value = await ctx.$db.Config.findAll({
        where: { status: 1, key: { [Op.in]: query.keys.split(",") } },
        attributes: ["key", "value", "create_date", "update_date"],
      });

      return ctx.$ok(value);
    },
  },
  {
    method: "post",
    path: "/config/update",
    handler: async ({ ctx, body }) => {
      const key = ["keys"].find((i) => body[i] === undefined);
      if (key) {
        return ctx.$err(400, key + " 缺失");
      }

      for (const item of body.keys) {
        const target = await ctx.$db.Config.findOne({ where: { key: item.key } });
        if (target) {
          await ctx.$db.Config.update({ value: item.value }, { where: { key: item.key } });
        } else {
          await ctx.$db.Config.create({ key: item.key, value: item.value });
        }
      }

      return ctx.$ok();
    },
  },
];
