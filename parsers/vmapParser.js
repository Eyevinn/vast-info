const parser = require("fast-xml-parser");

const adBreakParser = require("./adBreakParser");

const parse = (vmap, noPrint) => {
  const data = [];
  const vmapJson = parser.parse(vmap, { ignoreAttributes: false });
  const numberOfAdbreaks = Array.isArray(vmapJson["vmap:VMAP"]["vmap:AdBreak"])
    ? vmapJson["vmap:VMAP"]["vmap:AdBreak"].length
    : 1;
  for (let i = 0; i < numberOfAdbreaks; i++) {
    const adbreak =
      vmapJson["vmap:VMAP"]["vmap:AdBreak"][i]["vmap:AdSource"][
        "vmap:VASTAdData"
      ];
    if (noPrint) {
      data.push(adBreakParser.parse(adbreak, i, noPrint));
    } else {
      adBreakParser.parse(adbreak, i, noPrint);
    }
  }
  if (noPrint) {
    return data;
  }
};

module.exports = {
  parse
};
