module.exports = [
  {
    label: "内置",
    value: 1,
    config: "account_config",
    view: (v) => v.open,
    login: require("./account/login"),
  },
  {
    label: "飞书",
    value: 2,
    config: "feishu_config",
    view: (v) => (v.open ? { appId: v.appId } : null),
    login: require("./feishu/login"),
  },
  {
    label: "钉钉",
    value: 3,
    config: "dingding_config",
    view: (v) => (v.open ? { corpId: v.corpId, clientId: v.clientId } : null),
    login: require("./dingding/login"),
  },
  {
    label: "企微",
    value: 4,
    config: "qiwei_config",
    view: (v) => (v.open ? { corpId: v.corpId, appAgentId: v.appAgentId } : null),
    login: require("./qiwei/login"),
  },
  {
    label: "飞牛",
    value: 5,
    config: "feiniu_config",
    view: (v) => (v.open ? { host: v.host, clientId: v.clientId } : null),
    login: require("./feiniu/login"),
  },
];
