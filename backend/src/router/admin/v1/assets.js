const fs = require("fs").promises;

const { join, runtime } = _require("utils/path/dir");
const checkPath = _require("utils/checkPath");
const pathServer = _require("utils/path/server");

module.exports = [
  {
    method: "post",
    path: "/assets/upload",
    handler: async ({ ctx, body, files }) => {
      const file = files.file;

      if (!file) {
        return ctx.$err(400, "未上传文件");
      }

      await checkPath.dir(join(runtime, "./upload", body.dir || ""));

      const newPath = join("./upload", body.dir || "", file.newFilename);

      await fs.rename(file.filepath, join(runtime, newPath));

      return ctx.$ok({ path: newPath, fullPath: `${pathServer.host}/${newPath}` });
    },
  },
];
