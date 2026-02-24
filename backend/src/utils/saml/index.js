const saml = require("samlify");
const validator = require("@authenio/samlify-node-xmllint");

saml.setSchemaValidator(validator);

module.exports = saml;
