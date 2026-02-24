const axios = require("axios");

module.exports = async function (opt) {
  const { ctx, appId, appSecret, code } = opt;

  try {
    const { data } = await axios.post("https://open.feishu.cn/open-apis/authen/v2/oauth/token", {
      grant_type: "authorization_code",
      client_id: appId,
      client_secret: appSecret,
      code,
    });

    if (data.code !== 0) {
      throw { message: data.msg || "" };
    }

    return [, data.access_token];
  } catch (e) {
    return [ctx.$err(500, e ? e.message || e.msg || JSON.stringify(e) : "error")];
  }
};
