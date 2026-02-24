const base = require("./base");
const production = require("./production");

const assignDeep = _require("utils/assignDeep");

const isDev = process.env.NODE_ENV === "development";

module.exports = assignDeep({ isDev }, base, isDev ? {} : production);
