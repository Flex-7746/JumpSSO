const login = _require("utils/login");
const getConfig = _require("utils/oidc/getConfig");
const getUserFlag = _require("utils/getUserFlag");

module.exports = [
  {
    method: "get",
    path: "/oidc/:id",
    handler: async ({ ctx }) => {
      const oidcDetails = await ctx.$oidc.interactionDetails(ctx.req, ctx.res);

      const [err, user] = await login.auth(ctx);

      if (err) {
        if (err.code === 401) {
          await login.jump(ctx, { type: "oidc", client: oidcDetails.params.client_id, callback: oidcDetails.returnTo });
          return;
        } else {
          return err;
        }
      }

      try {
        const { prompt } = oidcDetails;

        // 登录
        if (prompt.name === "login") {
          const target = await $db.Entry.findOne({ where: { status: 1, type: 1, client: oidcDetails.params.client_id } });
          if (!target) {
            return;
          }

          const entry = target.toJSON();
          const config = getConfig(entry);

          const accountId = await getUserFlag({ ctx, str: config.userFlag, user, entry });

          await ctx.$cache(accountId, user.openid);

          await ctx.$oidc.interactionFinished(ctx.req, ctx.res, { login: { accountId } });
          return;
        }

        // 授权
        if (prompt.name === "consent") {
          const grant = oidcDetails.grantId ? await ctx.$oidc.Grant.find(oidcDetails.grantId) : new ctx.$oidc.Grant({ accountId: oidcDetails.session.accountId, clientId: oidcDetails.params.client_id });

          if (prompt.details.missingOIDCScope) {
            grant.addOIDCScope(prompt.details.missingOIDCScope.join(" "));
          }

          await ctx.$oidc.interactionFinished(ctx.req, ctx.res, { consent: { grantId: await grant.save() } });

          return;
        }
      } catch (e) {
        return ctx.$err(500, e);
      }
    },
  },
];
