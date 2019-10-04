const yargs = require("yargs");

const fs = require("fs");
const path = require("path");

const http = require("./utils/http");
const constants = require("./utils/constants");
const adBreakParser = require("./utils/adBreakParser");
const vmapParser = require("./utils/vmapParser");

const options = yargs
  .usage("Usage: -u <url>")
  .option("u", { alias: "url", describe: "The url to fetch VAST or VMAP from.", type: "string", demandOption: true})
  .argv;

const url = options.url; // "https://adinsertion-proxy-prod.herokuapp.com/ads?dd=450"
// temp
const vast = fs.readFileSync(path.join(__dirname, "tests/mock/vast.xml"), "utf-8");
const vmap = fs.readFileSync(path.join(__dirname, "tests/mock/vmap.xml"), "utf-8");

(async function () {
  const xml = await http.get(url);
  // const xml = vast;
  const format = xml.includes(constants.Format.VMAP)
    ? constants.Format.VMAP
    : constants.Format.VAST;

  const adbreakInfo = [];

  switch (format) {
    case constants.Format.VAST:
      adBreakParser.parse(xml);
      break;
    case constants.Format.VMAP:
      vmapParser.parse(xml);
      break;
  }
})();
