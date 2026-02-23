const key = require("./key");

const common = async (opt) => {
  const { id, name, store } = opt;

  id && (await store(`${name}_${id}`, null));
};

const multi = async (opt, v) => {
  await common(opt);
  opt.payload && (await common({ ...opt, id: key[v](opt.payload[v]) }));
};

module.exports = {
  Common: common,
  AuthorizationCode: (opt) => multi(opt, "grantId"),
  AccessToken: (opt) => multi(opt, "grantId"),
  RefreshToken: (opt) => multi(opt, "grantId"),
  Session: (opt) => multi(opt, "uid"),
};
