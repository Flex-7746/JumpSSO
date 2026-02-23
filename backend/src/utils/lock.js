module.exports = {
  check: async (opt) => {
    const { ctx, key, maxCount, lockTimeout, match } = opt;
    const now = Date.now();

    const cacheData = await ctx.$cache(key);
    if (cacheData && cacheData.count >= maxCount) {
      const sec = lockTimeout - Math.floor((now - cacheData.time) / 1000);
      if (sec > 0) {
        const min = sec > 60 ? Math.ceil(sec / 60) : 0;
        return [["请", min ? `${min}分钟` : `${sec}秒`, "后重试"].join("")];
      }
    }

    const value = await match();

    if (value) {
      await ctx.$cache(key, null);

      return ["", value];
    }

    const curCount = cacheData ? cacheData.count + 1 : 1;

    await ctx.$cache(key, { count: curCount, time: now }, { expire: lockTimeout });

    if (curCount >= maxCount) {
      const sec = lockTimeout;
      const min = sec > 60 ? Math.ceil(sec / 60) : 0;
      return [["请", min ? `${min}分钟` : `${sec}秒`, "后重试"].join("")];
    }

    return [maxCount - curCount];
  },
};
