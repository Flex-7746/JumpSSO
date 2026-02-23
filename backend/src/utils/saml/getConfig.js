function getDefConfig() {
  return {
    key: "",
    keyPass: "",
    cer: "",
    spMetadata: "",
    spNameid: "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified",
    spLoginExpire: 10080,
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
    const custom = JSON.parse(entry.saml_config);
    return { ...def, ...custom };
  } catch {
    return def;
  }
};
