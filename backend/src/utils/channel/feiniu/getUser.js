const axios = require("axios");

module.exports = async function (opt) {
  const { ctx, host, access_token } = opt;

  try {
    const { data } = await axios.post(
      `${host}/oauthapi/userinfo`,
      {},
      {
        headers: { Authorization: `Bearer ${access_token}` },
      },
    );

    if (data.code !== 0) {
      throw { message: data.msg || "" };
    }

    return [, data.data];
  } catch (e) {
    return [ctx.$err(500, e ? e.message || e.msg || JSON.stringify(e) : "error")];
  }
};
