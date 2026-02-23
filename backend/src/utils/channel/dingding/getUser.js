const axios = require("axios");

module.exports = async function (opt) {
  const { ctx, access_token, code } = opt;

  try {
    const { data: data1 } = await axios.post(
      "https://oapi.dingtalk.com/topapi/v2/user/getuserinfo",
      {
        code,
      },
      { params: { access_token } },
    );

    if (data1.errcode !== 0) {
      throw { message: data1.errmsg || "" };
    }

    const { data: data2 } = await axios.post(
      "https://oapi.dingtalk.com/topapi/v2/user/get",
      {
        userid: data1.result.userid,
      },
      { params: { access_token } },
    );

    if (data2.errcode !== 0) {
      throw { message: data2.errmsg || "" };
    }

    return [, data2.result];
  } catch (e) {
    return [ctx.$err(500, e ? e.message || e.msg || JSON.stringify(e) : "error")];
  }
};
