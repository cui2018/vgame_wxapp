const MD5 = require("md5.js");
const S = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function sign(obj) {
  obj.timeStamp = parseInt(new Date().getTime() / 1000);
  obj.nonce_str = "";
  for (let i = 0; i < 32; i++) {
    obj.nonce_str += S.substr(rand(0, S.length - 1), 1).toString();
  }
  let keys = Object.keys(obj);
  keys.sort((a,b) => {
    return a < b ? -1 : 1;
  });
  let param = [];
  for (let [i, key] of keys.entries()) {
    param.push(key + "=" + (typeof obj[key] == "string" || typeof obj[key] == "number" ? obj[key] : MD5(JSON.stringify(obj[key]))));
  }
  let sign = param.join("&");
  sign += "&key=Asc9C8Uv89I4gdNfsBG89dF8ds80VgYu";
  sign = MD5(sign);
  obj.sign = sign;
  return obj;
}
function rand(from, to) {
  return parseInt(Math.random() * (parseFloat(to) - parseFloat(from) + 1)) + parseFloat(from);
}
module.exports = sign;