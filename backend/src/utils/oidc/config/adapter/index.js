const config = _require("config");

const genCache = _require("utils/genCache");

const upsert = require("./upsert");
const find = require("./find");
const destroy = require("./destroy");

const key = require("./key");

const store = genCache({ ...config.cache, prefix: "oidc" });

class OidcAdapter {
  constructor(name) {
    this.name = name;
  }

  async upsert(id, payload, expiresIn) {
    return (upsert[this.name] || upsert.Common)({ store, name: this.name, id, payload, expiresIn });
  }

  async find(id) {
    return (find[this.name] || find.Common)({ store, name: this.name, id });
  }

  async destroy(id) {
    return (destroy[this.name] || destroy.Common)({ store, name: this.name, id, payload: await this.find(id) });
  }

  async consume(id) {
    return this.destroy(id);
  }

  async findByUid(uid) {
    return this.find(await this.find(key.uid(uid)));
  }

  async revokeByGrantId(grantId) {
    return this.destroy(await this.find(key.grantId(grantId)));
  }
}

module.exports = OidcAdapter;
