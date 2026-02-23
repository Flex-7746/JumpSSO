const config = _require("config");

const pathServer = _require("utils/path/server");

const adapter = require("./adapter");
const jwks = require("./jwks");
const claims = require("./claims");

module.exports = {
  adapter,
  jwks,
  claims,

  pkce: { required: () => false },
  clientBasedCORS: () => true,
  features: { devInteractions: { enabled: false } },

  cookies: {
    names: {
      interaction: config.name + "_oidc_interaction",
      resume: config.name + "_oidc_interaction_resume",
      session: config.name + "_oidc_session",
    },
  },

  // code 始终未存储 offline_access，是 bug ?
  issueRefreshToken: (_ctx, client, _code) => client.grantTypeAllowed("refresh_token"),

  interactions: { url: (_ctx, interaction) => `${pathServer.loginOIDC}/${interaction.uid}` },

  findAccount: (_ctx, id) => ({
    accountId: id,
    claims: async () => {
      const user = await $cache(await $cache(id));

      return {
        email: user.email,
        email_verified: true,
        phone_number: user.phone,
        phone_number_verified: true,
        name: user.name,
        nickname: user.nickname,
        picture: user.picture,
      };
    },
  }),

  ttl: {
    Interaction: 60 * 60 * 2,
    Grant: 60 * 60 * 24 * 14,
    Session: 60 * 60 * 24 * 14,
    AccessToken: 60 * 60 * 2,
    RefreshToken: 60 * 60 * 24 * 14,
    IdToken: 60 * 60 * 2,
  },

  renderError: (ctx, _out, error) => {
    console.log(error);

    ctx.type = "html";
    ctx.body = `<!DOCTYPE html>
    <html>
    <head>
      <title>Error</title>
    </head>
    <body>
      <div style="text-align: center; padding: 30px 0">
        <h1>${error.error}</h1>
        <h2>${error.error_description}</h2>
      </div>
    </body>
    </html>`;
  },
};
