module.exports = async function install(app) {
  global.$ok = app.context.$ok = (data = null, msg = "操作成功", code = 200) => ({ code, msg, data });
  global.$err = app.context.$err = (code = 0, msg = "操作失败", data = null) => ({ code, msg, data });
};
