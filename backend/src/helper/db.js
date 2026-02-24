const md5 = require("md5");
const { Sequelize, DataTypes } = require("sequelize");

const config = _require("config");

const { join, runtime } = _require("utils/path/dir");
const crypto = _require("utils/crypto");

module.exports = async function install(app) {
  const { sqlite, mysql } = config.store;

  const sequelize = mysql.host ? new Sequelize(mysql.database, mysql.username, mysql.password, mysql) : new Sequelize(sqlite);

  const App = sequelize.define(
    "app",
    {
      status: { type: DataTypes.INTEGER, defaultValue: 1 }, // 0删除 1正常
      name: { type: DataTypes.STRING, allowNull: false },
      picture: { type: DataTypes.STRING(1024), defaultValue: "" },
      desc: { type: DataTypes.STRING(1024), defaultValue: "" },
    },
    { tableName: "app", updatedAt: "update_date", createdAt: "create_date" },
  );

  const Entry = sequelize.define(
    "entry",
    {
      status: { type: DataTypes.INTEGER, defaultValue: 1 }, // 0删除 1正常
      name: { type: DataTypes.STRING, allowNull: false },
      url: { type: DataTypes.TEXT, allowNull: false },
      type: { type: DataTypes.INTEGER, allowNull: false }, // 1oidc 2saml
      client: { type: DataTypes.STRING, allowNull: false },
      oidc_config: { type: DataTypes.TEXT, allowNull: false },
      saml_config: { type: DataTypes.TEXT, allowNull: false },
    },
    { tableName: "entry", updatedAt: "update_date", createdAt: "create_date" },
  );

  const User = sequelize.define(
    "user",
    {
      status: { type: DataTypes.INTEGER, defaultValue: 1 }, // 0删除 1正常
      channel: { type: DataTypes.INTEGER, defaultValue: 1 }, // 1内置账户 2飞书账户 3钉钉账户 4企微账户 5飞牛账户
      openid: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false },
      phone: { type: DataTypes.STRING, allowNull: false },
      name: { type: DataTypes.STRING, defaultValue: "" },
      nickname: { type: DataTypes.STRING, defaultValue: "" },
      picture: { type: DataTypes.TEXT, defaultValue: "" },
      password: { type: DataTypes.STRING, defaultValue: "" },
      role: { type: DataTypes.INTEGER, defaultValue: 1 }, // 0超级管理员 1普通用户 2管理员
    },
    { tableName: "user", updatedAt: "update_date", createdAt: "create_date" },
  );

  const Config = sequelize.define(
    "config",
    {
      status: { type: DataTypes.INTEGER, defaultValue: 1 }, // 0删除 1正常
      key: { type: DataTypes.STRING, allowNull: false },
      value: { type: DataTypes.TEXT, allowNull: false },
    },
    { tableName: "config", updatedAt: "update_date", createdAt: "create_date" },
  );

  App.hasMany(Entry, { foreignKey: "app_id", as: "entryData" });
  Entry.belongsTo(App, { foreignKey: "app_id", as: "appData" });

  global.$db = app.context.$db = { App, Entry, User, Config };

  await sequelize.sync();

  // 初始化管理员
  const custom = require(join(runtime, "./config.json"));
  const target = await User.findOne({ where: { id: 1 } });

  if (!target) {
    await User.create({
      channel: 1,
      openid: crypto.uuid(),
      email: "zhangsan@jumpsso.com",
      phone: "13300001111",
      name: "张三",
      nickname: "zhangsan",
      picture: "",
      password: md5(custom.initPass),
      role: 0,
    });

    console.log(`管理员名称: 13300001111`);
    console.log(`管理员密码: ${custom.initPass}`);
  }
};
