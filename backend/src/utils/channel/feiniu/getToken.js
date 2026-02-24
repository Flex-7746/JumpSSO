const axios = require("axios");

const FN_CLIENT_TOKEN = "channel_fn_token";

module.exports = async function (opt) {
  const { ctx, host, clientId, clientSecret, code } = opt;

  const cacheToken = await ctx.$cache(FN_CLIENT_TOKEN);
  if (cacheToken) {
    return [, cacheToken];
  }

  try {
    const { data } = await axios.post(
      `${host}/oauthapi/token`,
      {
        grant_type: "authorization_code",
        code,
        redirect_uri: "http://127.0.0.1",
      },
      {
        headers: {
          Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        },
      },
    );

    if (data.code !== 0) {
      throw { message: data.msg || "" };
    }

    if (data.data.access_token) {
      await ctx.$cache(FN_CLIENT_TOKEN, data.data.access_token, { expire: data.data.expires_in || 60 });

      return [, data.data.access_token];
    } else {
      throw { message: "调用错误" };
    }
  } catch (e) {
    return [ctx.$err(500, e ? e.message || e.msg || JSON.stringify(e) : "error")];
  }
};
