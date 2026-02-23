function replaceFlag(str, flags) {
  return flags.reduce((val, i) => val.replace(i.flag, i.value), str);
}

module.exports = {
  user: (str, user) =>
    replaceFlag(str, [
      { flag: "__EMAIL__", value: user.email },
      { flag: "__PHONE__", value: user.phone },
      { flag: "__NAME__", value: user.name },
      { flag: "__NICKNAME__", value: user.nickname },
    ]),
};
