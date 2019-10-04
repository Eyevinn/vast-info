const parser = require("fast-xml-parser");

const adBreakParser = require("./adBreakParser");

const parse = (vmap) => {
  const vmapJson = parser.parse(vmap, { ignoreAttributes: false });
  // console.log(vmapJson["vmap:VMAP"]["vmap:AdBreak"][0]["vmap:AdSource"]["vmap:VASTAdData"]);
  const numberOfAdbreaks = Array.isArray(vmapJson["vmap:VMAP"]["vmap:AdBreak"]) ? vmapJson["vmap:VMAP"]["vmap:AdBreak"].length : 1;
  for (let i = 0; i < numberOfAdbreaks; i++) {
    const adbreak = vmapJson["vmap:VMAP"]["vmap:AdBreak"][i]["vmap:AdSource"]["vmap:VASTAdData"];
    adBreakParser.parse(adbreak, i);
  }
};

module.exports = {
  parse
}
