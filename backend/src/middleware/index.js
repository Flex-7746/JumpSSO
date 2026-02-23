const middleware = [
  _require("utils/oidc"), // oidc
  require("./cors"), // 跨域请求
  require("./resource"), // 前端页面
  require("./body"), // 传参解析
  require("./cookie"), // cookie
  require("./auth"), // 登录态检测
  require("./router"), // 路由挂载
  require("./frontend"), // 前端页面
];

module.exports = async function install(app) {
  for (const fn of middleware) {
    await fn(app);
  }
};
