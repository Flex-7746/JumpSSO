const replace = (str, flag) => flag.reduce((val, i) => val.replace(i.flag, i.value), str);

const mapping = async (opt) => {
  const { ctx, str, entry } = opt;

  try {
    const target = await ctx.$db.Config.findOne({
      where: { status: 1, key: "mapping_config" },
      attributes: ["key", "value"],
    });

    if (!target) {
      return str;
    }

    const config = JSON.parse(target.value);

    let result = str;

    const userMapping = config.user.find((i) => i.from.includes(result));
    userMapping && (result = userMapping.to);

    const appMapping = config.app.find((i) => i.entry.includes(entry.client));
    appMapping && (result = appMapping.to);

    return result;
  } catch {
    return str;
  }
};

module.exports = async function (opt) {
  const { ctx, str, user, entry } = opt;

  return mapping({
    str: replace(str, [
      { flag: "__EMAIL__", value: user.email },
      { flag: "__PHONE__", value: user.phone },
      { flag: "__NAME__", value: user.name },
      { flag: "__NICKNAME__", value: user.nickname },
    ]),
    entry,
    ctx,
  });
};
