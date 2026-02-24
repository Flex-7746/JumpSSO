const config = _require("config");

const genCache = _require("utils/genCache");

// 新增：ctx.$session('key', { a: 1, b: 2 })
// 读取：ctx.$session('key')
// 删除：ctx.$session('key', null)
// 清空自己：ctx.$session(null)
// 查看所有：ctx.$session()
module.exports = async function install(app) {
  const store = genCache({ ...config.cache, prefix: "session" });

  app.context.$session = async function (key, value) {
    if (key === null) {
      await store(this.$cookieID, null);
      return;
    }

    const userConfig = (await store(this.$cookieID)) || {};

    if (key === undefined) {
      return userConfig;
    }

    if (value === null) {
      Reflect.deleteProperty(userConfig, key);
      await store(this.$cookieID, userConfig);
      return;
    }

    if (value === undefined) {
      return userConfig[key];
    } else {
      userConfig[key] = value;
      await store(this.$cookieID, userConfig);
    }
  };
};
