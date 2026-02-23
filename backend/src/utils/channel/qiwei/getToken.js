const axios = require("axios");

const QW_CLIENT_TOKEN = "channel_qw_token";

module.exports = async function (opt) {
  const { ctx, corpId, appSecret } = opt;

  const cacheToken = await ctx.$cache(QW_CLIENT_TOKEN);
  if (cacheToken) {
    return [, cacheToken];
  }

  try {
    const { data } = await axios.get("https://qyapi.weixin.qq.com/cgi-bin/gettoken", {
      params: { corpid: corpId, corpsecret: appSecret },
    });

    if (data.errcode !== 0) {
      throw { message: data.errmsg || "" };
    }

    if (data.access_token) {
      await ctx.$cache(QW_CLIENT_TOKEN, data.access_token, { expire: data.expires_in || 60 });

      return [, data.access_token];
    } else {
      throw { message: "调用错误" };
    }
  } catch (e) {
    return [ctx.$err(500, e ? e.message || e.msg || JSON.stringify(e) : "error")];
  }
};
