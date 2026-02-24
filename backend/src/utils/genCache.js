const fs = require("fs").promises;
const path = require("path");
const md5 = require("md5");

const Redis = require("ioredis");

async function fileCache(key, value, opt = {}) {
  if (key === null) {
    await fs.rm(this.root, { recursive: true, force: true });
    await fs.mkdir(this.root, { recursive: true });
    return;
  }

  const prefix = opt.prefix || this.prefix;
  const encode = opt.encode || this.encode;

  const filePath = path.join(this.root, `${prefix}_${encode ? md5(key) : key}`);

  if (value === null) {
    await fs.rm(filePath, { recursive: true, force: true });
    return;
  }

  if (value === undefined) {
    try {
      const val = await fs.readFile(filePath, "utf8");
      const obj = JSON.parse(val);

      if (Date.now() > obj.expire) {
        await fileCache.call(this, key, null);
      } else {
        return obj.value;
      }
    } catch {
      await fileCache.call(this, key, null);
    }

    return;
  } else {
    const expire = opt.expire !== undefined ? opt.expire : this.expire;

    await fs.mkdir(this.root, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify({ value, expire: Date.now() + expire * 1000 }), "utf8");
  }
}

async function redisCache(key, value, opt = {}) {
  const prefix = opt.prefix || this.prefix;
  const encode = opt.encode || this.encode;

  if (key === null) {
    let cursor = "0";

    do {
      const [nextCursor, keys] = await this.redis.scan(cursor, "MATCH", `${prefix}_` + "*", "COUNT", 100);

      cursor = nextCursor;

      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } while (cursor !== "0");

    return;
  }

  const name = `${prefix}_${encode ? md5(key) : key}`;

  if (value === null) {
    await this.redis.del(name);
    return;
  }

  if (value === undefined) {
    const val = await this.redis.get(name);

    if (val !== null) {
      try {
        return JSON.parse(val);
      } catch {
        await redisCache.call(this, key, null);
      }
    }

    return;
  } else {
    await this.redis.set(name, JSON.stringify(value), "EX", opt.expire !== undefined ? opt.expire : this.expire);
  }
}

module.exports = function genCache(option) {
  const { common, file, redis, prefix } = option;

  if (redis.host && redis.password) {
    return redisCache.bind({ ...common, redis: new Redis(redis), prefix });
  } else {
    return fileCache.bind({ ...common, ...file, prefix });
  }
};
