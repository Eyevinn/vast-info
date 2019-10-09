const parser = require("fast-xml-parser");

const constants = require("../utils/constants");
const adObjectParser = require("./adObjectParser");

const parse = (vast, index, noPrint) => {
  const vastJson =
    vast instanceof Object
      ? vast
      : parser.parse(vast, { ignoreAttributes: false });
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
      /**
       * This is just an assumption regarding the naming of the adsystem and titles
       * Needs to be defined for each source
       */
      if (obj[constants.AdInfoKeys.SYSTEM].includes("proxy")) {
        switch (true) {
          case obj[constants.AdInfoKeys.TITLE].includes("bumper"):
            bumpers += 1;
            break;
          default:
            trailers += 1;
            break;
        }
      } else {
        inlineAds += 1;
      }

      breakDuration += obj[constants.AdInfoKeys.DURATION]
        ? obj[constants.AdInfoKeys.DURATION]
        : 0;
    }
    prettyPrintObject.push(obj);
  });

  const breakTitle =
    !index && index === 0
      ? "Pre-roll Block"
      : index
      ? `Break #${index}`
      : "Break Info";
  /**
   * We're creating an objext with themes property keys as they will show as titles in the printed table
   */
  const vastInfo = {
    [breakTitle]: {
      [constants.BreakInfoKeys.NUMBER_OF_FILMS]: ads.length,
      [constants.BreakInfoKeys
        .TOTAL_DURATION]: `${breakDuration} seconds + ${wrapperAds} wrappers`,
      [constants.BreakInfoKeys.INLINE_ADS]: inlineAds,
      [constants.BreakInfoKeys.WRAPPER_ADS]: wrapperAds,
      [constants.BreakInfoKeys.BUMPERS]: bumpers,
      [constants.BreakInfoKeys.TRAILERS]: trailers
    }
  };
  if (noPrint) {
    return {
      vastInfo,
      prettyPrintObject
    };
  } else {
    console.table(vastInfo);
    console.table(prettyPrintObject);
  }
};

module.exports = {
  parse
};
