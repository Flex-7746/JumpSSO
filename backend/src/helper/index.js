const helper = [
  require("./db"), // 数据库
  require("./result"), // 响应
  require("./cache"), // 缓存
  require("./session"), // session
];

module.exports = async function install(app) {
  for (const fn of helper) {
    await fn(app);
  }
};
