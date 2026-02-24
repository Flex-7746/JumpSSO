const config = _require("config");

const pathServer = _require("utils/path/server");

const host = config.isDev ? "http://localhost:5173" : pathServer.host;

module.exports = {
  host,
  login: (key) => `${host}/sign/login?key=${key}`,
};
