const parser = require("fast-xml-parser");

const adObjectParser = require("./adObjectParser");

const parse = (vast, index) => {
  const vastJson = vast instanceof Object ? vast : parser.parse(vast, { ignoreAttributes: false });
  const ads = vastJson.VAST.Ad;

  let bumpers = 0;
  let trailers = 0;
  let inlineAds = 0;
  let wrapperAds = 0;

  let breakDuration = 0;

  const prettyPrintObject = [];
  ads.forEach(ad => {
    let obj = {};
    if (ad.Wrapper) {
      wrapperAds += 1;
      obj = adObjectParser.parseWrapper(ad);
    }
    if (ad.InLine) {
      obj = adObjectParser.parseInLine(ad);
      if (obj.AdSystem.includes("proxy")) {
        switch (true) {
          case obj.AdTitle.includes("bumper"):
            bumpers += 1;
            break;
          default:
            trailers += 1;
            break;
        }
      } else {
        inlineAds += 1;
      }

      breakDuration += obj["Duration (seconds)"] ? obj["Duration (seconds)"] : 0;
    }
    prettyPrintObject.push(obj);
  });

  const breakTitle = !index && index === 0 ? "Pre-roll Block" : index ? `Break #${index}` : "Break Info";
  const vastInfo = {
    [breakTitle]: {
      "Number of films": ads.length,
      "Total duration": `${breakDuration} seconds + ${wrapperAds} wrappers`,
      "Inline Ads": inlineAds,
      "Wrapper Ads": wrapperAds,
      "Detected Bumpers / Vignettes": bumpers,
      "Detected Trailers": trailers
    }
  };

  console.table(vastInfo);
  console.table(prettyPrintObject);
}

module.exports = {
  parse
}
