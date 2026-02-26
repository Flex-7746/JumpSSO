const login = _require("utils/login");
const saml = _require("utils/saml");
const utils = _require("utils/saml/utils");
const getUserFlag = _require("utils/getUserFlag");

module.exports = [
  {
    method: "get",
    path: "/saml/metadata/:id",
    handler: async ({ ctx, params, query }) => {
      const entry = await $db.Entry.findOne({
        where: { status: 1, client: params.id },
        include: {
          model: ctx.$db.App,
          as: "appData",
          attributes: ["name"],
        },
      });

      if (!entry) {
        return ctx.$err(404, "不存在的应用配置");
      }

      query.download && ctx.set("Content-Disposition", `attachment; filename=${encodeURIComponent(entry.appData.name)}-${encodeURIComponent(entry.name)}-IdPMetadata.xml`);

      ctx.type = "application/xml";
      ctx.body = utils.genMetadata(entry.toJSON());
    },
  },
  {
    method: "all",
    path: "/saml/:id",
    handler: async ({ ctx, query, body, params }) => {
      const target = await $db.Entry.findOne({ where: { status: 1, client: params.id } });

      if (!target) {
        return ctx.$err(404, "不存在的应用配置");
      }

      const method = ctx.request.method.toLocaleLowerCase();

      const [err, user] = await login.auth(ctx);

      if (err) {
        if (err.code === 401) {
          await login.jump(ctx, { type: "saml", client: params.id, callback: ctx.request.url, method, query, body });
          return;
        } else {
          return err;
        }
      }

      const entry = target.toJSON();
      const config = utils.getConfig(entry);

      const userid = await getUserFlag({ ctx, str: config.userFlag, user, entry });

      const info = method === "get" ? { type: "redirect", value: query } : { type: "post", value: body };

      const sp = saml.ServiceProvider({
        metadata: config.spMetadata,
        wantMessageSigned: true,
      });

      const idp = saml.IdentityProvider({
        metadata: utils.genMetadata(entry),
        privateKey: config.key,
        privateKeyPass: config.keyPass,
        loginResponseTemplate: {
          context: saml.SamlLib.defaultLoginResponseTemplate.context,
          attributes: config.attribute.map((i) => ({
            name: i.right,
            valueTag: `user.${i.right}`,
            nameFormat: "urn:oasis:names:tc:SAML:2.0:attrname-format:basic",
            valueXsiType: "xs:string",
          })),
        },
      });

      const requestInfo = await idp.parseLoginRequest(sp, info.type, { query, body });

      const responseInfo = await idp.createLoginResponse(
        sp,
        requestInfo,
        "post",
        user,
        (template) => {
          const params = utils.genSamlParam({
            entry,
            sp,
            idp,
            requestInfo,
            userid,
            attrs: config.attribute.reduce((attrs, i) => {
              const key = i.right.split("");
              key[0] = key[0].toLocaleUpperCase();
              attrs[`attrUser${key.join("")}`] = user[i.left];
              return attrs;
            }, {}),
          });
          return { id: params.ID, context: saml.SamlLib.replaceTagsByValue(template, params) };
        },
        false,
        info.value.RelayState || info.value.relayState,
      );

      ctx.type = "text/html";
      ctx.body = utils.genPostForm(responseInfo);

      // 测试代码，查看返回的 xml 信息，放开注释即可
      // const { samlContent } = await sp.parseLoginResponse(idp, "post", { body: { SAMLResponse: responseInfo.context } });
      // ctx.type = "application/xml";
      // ctx.body = samlContent;
    },
  },
];
