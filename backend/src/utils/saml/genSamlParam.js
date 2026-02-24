const saml = require("./index");
const getConfig = require("./getConfig");

module.exports = function getSamlParam({ entry, idp, sp, requestInfo, userid, attrs }) {
  const config = getConfig(entry);

  const idpSetting = idp.entitySetting;

  const spEntityID = sp.entityMeta.getEntityID();
  const acl = sp.entityMeta.getAssertionConsumerService("post");

  const nowTime = new Date();
  const nowText = nowTime.toISOString();
  const afterTime = new Date(nowTime.getTime() + 5 * 60 * 1000);
  const afterText = afterTime.toISOString();
  const sessionTime = new Date(nowTime.getTime() + (config.spLoginExpire || 7 * 24 * 60) * 60 * 1000);
  const sessionText = sessionTime.toISOString();

  const AuthnContext = requestInfo.extract?.authnContextClassRef || "urn:oasis:names:tc:SAML:2.0:ac:classes:unspecified";
  const NameIDFormat = requestInfo.extract?.nameIDPolicy?.format || config.spNameid || "";

  return {
    ID: idpSetting.generateID(),
    AssertionID: idpSetting.generateID(),
    Destination: acl,
    Audience: spEntityID,
    EntityID: spEntityID,
    SubjectRecipient: acl,
    Issuer: idp.entityMeta.getEntityID(),
    IssueInstant: nowText,
    AssertionConsumerServiceURL: acl,
    StatusCode: saml.Constants.StatusCode.Success,
    ConditionsNotBefore: nowText,
    ConditionsNotOnOrAfter: afterText,
    SubjectConfirmationDataNotOnOrAfter: afterText,
    NameIDFormat,
    NameID: userid,
    InResponseTo: requestInfo.extract?.request?.id,
    AuthnStatement: `<saml:AuthnStatement AuthnInstant="{AuthnInstant}" SessionNotOnOrAfter="{SessionNotOnOrAfter}" SessionIndex="{SessionIndex}"><saml:AuthnContext><saml:AuthnContextClassRef>${AuthnContext}</saml:AuthnContextClassRef></saml:AuthnContext></saml:AuthnStatement>`,
    AuthnInstant: nowText,
    SessionNotOnOrAfter: sessionText,
    SessionIndex: idpSetting.generateID(),
    ...attrs,
  };
};
