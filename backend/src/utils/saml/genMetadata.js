const pathServer = _require("utils/path/server");
const getConfig = require("./getConfig");

module.exports = function genMetadata(entry) {
  const config = getConfig(entry);

  const loginUrl = `${pathServer.host}${pathServer.loginSAML}/${entry.client}`;
  const entityID = `${pathServer.host}${pathServer.loginSAML}/metadata/${entry.client}`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="${entityID}">
  <md:IDPSSODescriptor WantAuthnRequestsSigned="false" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <md:KeyDescriptor use="signing">
      <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
        <ds:X509Data>
          <ds:X509Certificate>${config.cer.replace(/\n/g, "").match(/^-----BEGIN CERTIFICATE-----(.*)-----END CERTIFICATE-----$/)[1]}</ds:X509Certificate>
        </ds:X509Data>
      </ds:KeyInfo>
    </md:KeyDescriptor>
    <md:NameIDFormat>${config.spNameid}</md:NameIDFormat>
    ${config.attribute.map((i) => `<md:Attribute><md:AttributeName Format="urn:oasis:names:tc:SAML:2.0:attrname-format:basic">${i.right}</md:AttributeName><md:AttributeFriendlyName>${i.left}</md:AttributeFriendlyName></md:Attribute>`).join("")}
    <md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="${loginUrl}"/>
    <md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="${loginUrl}"/>
  </md:IDPSSODescriptor>
</md:EntityDescriptor>`;
};
