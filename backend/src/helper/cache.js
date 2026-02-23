const config = _require("config");

const genCache = _require("utils/genCache");

// 新增：ctx.$cache('key', { a: 1, b: 2 })
// 读取：ctx.$cache('key')
// 删除：ctx.$cache('key', null)
// 清空：ctx.$cache(null)
module.exports = async function install(app) {
  global.$cache = app.context.$cache = genCache({ ...config.cache, prefix: "cache" });
};
