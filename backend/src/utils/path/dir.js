const path = require("path");

const join = path.join;

const backend = join(__dirname, "../../../");

module.exports = {
  join,
  runtime: join(backend, "./runtime"),
  web: join(backend, "./web"),
  public: join(backend, "./public"),
};
