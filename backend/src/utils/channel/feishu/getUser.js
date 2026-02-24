const axios = require("axios");

module.exports = async function (opt) {
  const { ctx, access_token } = opt;

  try {
    const { data } = await axios.get("https://open.feishu.cn/open-apis/authen/v1/user_info", {
      headers: { get: { Authorization: `Bearer ${access_token}` } },
    });

    if (data.code !== 0) {
      throw { message: data.msg || "" };
    }

    return [, data.data];
  } catch (e) {
    return [ctx.$err(500, e ? e.message || e.msg || JSON.stringify(e) : "error")];
  }
};
