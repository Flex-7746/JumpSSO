const config = _require("config");

module.exports = {
  host: config.server,
  loginCallback: config.server + "/server/callback",
  loginOIDC: "/server/oidc",
  loginSAML: "/server/saml",
  oidcBase: "/oidc",
};
