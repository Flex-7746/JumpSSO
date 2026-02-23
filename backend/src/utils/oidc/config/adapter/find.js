const getConfig = require("../../getConfig");

const common = async (opt) => {
  const { store, name, id } = opt;

  return id ? store(`${name}_${id}`) : undefined;
};

module.exports = {
  Common: common,

  Client: async (opt) => {
    const { id } = opt;

    const entry = await $db.Entry.findOne({ where: { status: 1, type: 1, client: id } });
    if (!entry) {
      return;
    }

    const config = getConfig(entry);
    if (!config.secret) {
      return;
    }

    return {
      client_id: entry.client,
      client_secret: config.secret,
      redirect_uris: (config.redirect || "").split(","),
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
    };
  },
};
