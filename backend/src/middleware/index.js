const middleware = [
  require("./cors"), // 跨域请求
  require("./resource"), // 静态资源页面
  require("./cookie"), // cookie
  _require("utils/oidc"), // oidc
  require("./body"), // 传参解析
  require("./auth"), // 登录态检测
  require("./router"), // 路由挂载
  require("./frontend"), // 前端页面
];

module.exports = async function install(app) {
  for (const fn of middleware) {
    await fn(app);
  }
};
