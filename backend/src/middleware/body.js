const { koaBody } = require("koa-body");

const { join, runtime } = _require("utils/path/dir");
const checkPath = _require("utils/checkPath");

module.exports = async function install(app) {
  app.use(
    koaBody({
      multipart: true,
      formidable: {
        uploadDir: await checkPath.dir(join(runtime, "./upload")),
        keepExtensions: true,
      },
    }),
  );
};
