module.exports = []
  .concat(
    // routes
    require("./sign"),
    require("./assets"),
    require("./app"),
    require("./entry"),
    require("./user"),
    require("./config"),
  )
  .map((i) => ({ ...i, path: `/v1${i.path}` }));
