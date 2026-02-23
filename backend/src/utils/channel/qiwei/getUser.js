const axios = require("axios");

module.exports = async function (opt) {
  const { ctx, access_token, code } = opt;

  try {
    const { data: data1 } = await axios.get("https://qyapi.weixin.qq.com/cgi-bin/auth/getuserinfo", {
      params: { access_token, code },
    });

    if (data1.errcode !== 0) {
      throw { message: data1.errmsg || "" };
    }

    const { data: data2 } = await axios.get("https://qyapi.weixin.qq.com/cgi-bin/user/get", {
      params: { access_token, userid: data1.userid },
    });

    if (data2.errcode !== 0) {
      throw { message: data2.errmsg || "" };
    }

    const { data: data3 } = await axios.post(
      "https://qyapi.weixin.qq.com/cgi-bin/auth/getuserdetail",
      {
        user_ticket: data1.user_ticket,
      },
      { params: { access_token } },
    );

    if (data3.errcode !== 0) {
      throw { message: data3.errmsg || "" };
    }

    return [, { ...data2, ...data3 }];
  } catch (e) {
    return [ctx.$err(500, e ? e.message || e.msg || JSON.stringify(e) : "error")];
  }
};
