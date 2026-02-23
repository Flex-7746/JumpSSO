const assignDeep = _require("utils/assignDeep");
const { join, runtime } = _require("utils/path/dir");
const { avgs, redis, mysql } = _require("utils/avgs");

const ONE_DAY = 24 * 60 * 60;

const name = "jumpsso";

module.exports = {
  // 名称、服务地址、本机端口
  name,
  server: avgs.server || "http://localhost:17746",
  port: avgs.port || 17746,

  // cookie 配置
  cookie: {
    name: name + "_cookie",
    key: "Mppju5oETQwn96sYRYAFkMxT9VL6qqKl",
    expire: 7 * ONE_DAY,
  },

  // 数据缓存
  cache: {
    file: {
      root: join(runtime, "./cache"),
    },
    redis: assignDeep({ username: "", password: "", host: "", port: 6379, db: 0 }, redis),
    common: {
      expire: 7 * ONE_DAY,
      encode: false,
    },
  },

  // 数据存储
  store: {
    // sqlite3 安装
    // npm install sqlite3 --build-from-source --target_arch=darwin-arm64
    // npm install sqlite3 --build-from-source --target_arch=darwin-amd64
    sqlite: {
      dialect: "sqlite",
      storage: join(runtime, "./db.sqlite"),
      logging: false,
    },

    // mysql2
    mysql: {
      dialect: "mysql",
      dialectModule: require("mysql2"),
      logging: false,
      ...assignDeep({ username: "", password: "", host: "", port: 3306, database: "" }, mysql),
    },
  },
};
