const avgs = (() => {
  const args = process.argv.slice(2);

  const parsedArgs = {};

  args.forEach((arg) => {
    if (arg.startsWith("--")) {
      const [key, value] = arg.replace("--", "").split("=");
      parsedArgs[key] = value || "";
    }
  });

  return parsedArgs;
})();

function getLinkParams(str, type) {
  const [account, link1] = str.split("@");
  const [username, password] = account.split(":");
  const [host, link2] = link1.split(":");
  const [port, path] = link2.split("/");

  return {
    username,
    password,
    host,
    port,
    [type === "redis" ? "db" : "database"]: path,
  };
}

module.exports = {
  avgs,

  redis: avgs.redis ? getLinkParams(avgs.redis, "redis") : {},
  mysql: avgs.mysql ? getLinkParams(avgs.mysql, "mysql") : {},
};
