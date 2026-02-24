module.exports = function getPostForm(responseInfo) {
  return `<!DOCTYPE html>
<html lang="en">
  <body>
    <form method="post" action="${responseInfo.entityEndpoint}">
      <input type="hidden" name="${responseInfo.contextName || "SAMLResponse"}" value="${responseInfo.context}" />
      ${responseInfo.relayState ? `<input type="hidden" name="RelayState" value="${responseInfo.relayState}" />` : ""}
    </form>
    <script>
      document.forms[0].submit()
    </script>
  </body>
</html>`;
};
