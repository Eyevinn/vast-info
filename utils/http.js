const fetch = require("node-fetch");

const get = async (url) => {
  try {
    const response = await fetch(url);
    const content = await response.text();
    return content;
  } catch (error) {
    console.error(error)
  }
};

module.exports = {
  get
}
