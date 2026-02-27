const config = _require("config");

const pathServer = _require("utils/path/server");
const pathWeb = _require("utils/path/web");

const adapter = require("./adapter");
const jwks = require("./jwks");
const claims = require("./claims");

module.exports = {
  adapter,
  jwks,
  claims,

  pkce: { required: () => false },
  clientBasedCORS: () => true,
  features: {
    devInteractions: { enabled: false },

    rpInitiatedLogout: {
      logoutSource: async (ctx, form) => {
        if (ctx.query.confirm) {
          await ctx.$cache(ctx.oidc.session.accountId, null);

          ctx.body = `<!DOCTYPE html>
        <html>
        <body>
          ${form}
          <button id="op.logoutForm.submit" type="submit" form="op.logoutForm" value="yes" name="logout"></button>
          <script>
            document.getElementById('op.logoutForm.submit').click()
          </script>
        </body>
        </html>`;
        } else {
          await ctx.redirect(pathWeb.logout("confirm"));
        }
      },

      postLogoutSuccessSource: async (ctx) => {
        const openid = await ctx.$session("openid");
        if (openid) {
          await ctx.$cache(await ctx.$session("openid"), null);
          await ctx.$session("openid", null);
        }
        await ctx.redirect(pathWeb.logout("success"));
      },
    },
  },

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
    ctx.redirect(
      pathWeb.error({
        code: "error",
        title: error.error || "系统错误",
        subtitle: error.error_description || "请重试",
      }),
    );
  },
};
