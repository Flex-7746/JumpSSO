module.exports = {
  routes: []
    .concat(
      // routes
      require("./login"),
      require("./oidc"),
      require("./saml"),
    )
    .map((i) => ({ ...i, path: `/server${i.path}` })),

  match: /^\/server/,

  auth: async () => {
    return true;
  },
};
