function getDefConfig() {
  return {
    secret: "",
    redirect: "",
    userFlag: "__EMAIL__",
    attribute: [
      { left: "email", right: "email" },
      { left: "phone", right: "phone" },
    ],
  };
}

module.exports = function getConfig(entry) {
  const def = getDefConfig();

  if (!entry) {
    return def;
  }

  try {
    const custom = JSON.parse(entry.oidc_config);
    return { ...def, ...custom };
  } catch {
    return def;
  }
};
