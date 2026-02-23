const axios = require("axios");

const DD_CORP_TOKEN = "channel_dd_token";

module.exports = async function (opt) {
  const { ctx, corpId, clientId, clientSecret } = opt;

  const cacheToken = await ctx.$cache(DD_CORP_TOKEN);
  if (cacheToken) {
    return [, cacheToken];
  }

  try {
    const { data } = await axios.post(`https://api.dingtalk.com/v1.0/oauth2/${corpId}/token`, {
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    });

    if (data.access_token) {
      await ctx.$cache(DD_CORP_TOKEN, data.access_token, { expire: data.expires_in || 60 });

      return [, data.access_token];
    } else {
      throw { message: "调用错误" };
    }
  } catch (e) {
    return [ctx.$err(500, e ? e.message || e.msg || JSON.stringify(e) : "error")];
  }
};
