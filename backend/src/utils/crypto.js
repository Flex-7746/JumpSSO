const crypto = require("crypto");

const BASE_KEY = "b11b5dbda6d9e90d0b7605f27e46f173";

function genSign(text, key = BASE_KEY) {
  const key1 = key.slice(0, 16);
  const key2 = key.slice(16);

  const cipher = crypto.createCipheriv("aes-128-cbc", Buffer.from(key1, "utf8"), Buffer.from(key2, "utf8"));

  let sign = "";
  sign += cipher.update(text, "utf8", "hex");
  sign += cipher.final("hex");

  return sign;
}

function deSign(sign, key = BASE_KEY) {
  const key1 = key.slice(0, 16);
  const key2 = key.slice(16);

  try {
    const cipher = crypto.createDecipheriv("aes-128-cbc", Buffer.from(key1, "utf8"), Buffer.from(key2, "utf8"));

    let src = "";
    src += cipher.update(sign, "hex", "utf8");
    src += cipher.final("utf8");

    return src;
  } catch {
    return false;
  }
}

function uuid() {
  return crypto.randomUUID().replace(/-/g, "");
}

function rand(len = 16) {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");

  const uuid = [];

  for (let i = 0; i < len; i++) {
    uuid[i] = chars[Math.ceil(Math.random() * chars.length)] || chars[0];
  }

  return uuid.join("");
}

module.exports = { genSign, deSign, uuid, rand };
