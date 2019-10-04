const fetch = require("node-fetch");

const get = async (url) => {
  const response = await fetch(url);
  const content = await response.text();
  return content;
};

module.exports = {
  get
}
