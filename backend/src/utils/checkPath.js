const fs = require("fs").promises;

module.exports = {
  dir: async (path, create = true) => {
    try {
      const stats = await fs.stat(path);

      if (!stats.isDirectory()) {
        throw new Error(`${path} is not a directory`);
      }

      return path;
    } catch (error) {
      if (error.code === "ENOENT") {
        if (create) {
          await fs.mkdir(path, { recursive: true });
          return path;
        }
      } else {
        console.log(error);
      }
    }
  },

  file: async (path, create) => {
    try {
      const stats = await fs.stat(path);

      if (!stats.isFile()) {
        throw new Error(`${path} is not a file`);
      }

      return path;
    } catch (error) {
      if (error.code === "ENOENT") {
        if (create) {
          await fs.writeFile(path, create());
          return path;
        }
      } else {
        console.log(error);
      }
    }
  },
};
