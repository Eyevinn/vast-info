const fs = require("fs");
const path = require("path");

const constants = require("./utils/constants");
const adBreakParser = require("./utils/adBreakParser");
const vmapParser = require("./utils/vmapParser");

// temp
const vast = fs.readFileSync(path.join(__dirname, "tests/mock/vast.xml"), "utf-8");
const vmap = fs.readFileSync(path.join(__dirname, "tests/mock/vmap.xml"), "utf-8");

// Do a request for given URL
const xml = vast;

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
