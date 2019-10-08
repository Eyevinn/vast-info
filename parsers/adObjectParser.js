const constants = require("../utils/constants");
const helpers = require("../utils/helpers");

const parseInLine = ad => {
  const Creative = Array.isArray(ad.InLine.Creatives.Creative)
    ? ad.InLine.Creatives.Creative[0]
    : ad.InLine.Creatives.Creative;
  const multipleMediaFiles =
    helpers.get(Creative, "Linear.MediaFiles") &&
    Array.isArray(Creative.Linear.MediaFiles.MediaFile);
  /**
   * If just a single media file, it's an object instead of an array
   * We want to create a human readable string like 1920x1080 instead of just one single part of the ratio
   */
  let highestResolution = !multipleMediaFiles
    ? `${Creative.Linear.MediaFiles.MediaFile["@_width"]}x${
        Creative.Linear.MediaFiles.MediaFile["@_height"]
      }`
    : "";
  let lowestResolution = !multipleMediaFiles
    ? `${Creative.Linear.MediaFiles.MediaFile["@_width"]}x${
        Creative.Linear.MediaFiles.MediaFile["@_height"]
      }`
    : "";
  /**
   * If multi files, we'll sort to find the one with lowest or highest ratio
   */
  if (multipleMediaFiles) {
    const fileList = Creative.Linear.MediaFiles.MediaFile;
    const sortedFiles = fileList.sort((a, b) =>
      a["@_height"] < b["@_height"] ? 1 : -1
    );
    highestResolution = `${sortedFiles[0]["@_width"]}x${
      sortedFiles[0]["@_height"]
    }`;
    lowestResolution = `${sortedFiles[sortedFiles.length - 1]["@_width"]}x${
      sortedFiles[sortedFiles.length - 1]["@_height"]
    }`;
  }

  let impressionsElements = helpers.get(ad, "InLine.Impression");
  let impressionTrackers = [];
  if (impressionsElements) {
    const urlStrings = Array.isArray(impressionsElements)
      ? impressionsElements
      : new Array(impressionsElements);
    for (let i = 0; i < urlStrings.length; i++) {
      let urlObject = new URL(urlStrings[i]);
      let host = urlObject.hostname;
      impressionTrackers.push(host);
    }
  }
  /**
   * We're creating an objext with themes property keys as they will show as titles in the printed table
   */
  return {
    [constants.AdInfoKeys.TYPE]: "InLine",
    [constants.AdInfoKeys.SYSTEM]: ad.InLine.AdSystem,
    [constants.AdInfoKeys.TITLE]: ad.InLine.AdTitle,
    [constants.AdInfoKeys.DURATION]: Creative.Linear.Duration
      ? helpers.durationAsSeconds(Creative.Linear.Duration)
      : false,
    [constants.AdInfoKeys.MEDIAFILES]: multipleMediaFiles
      ? Creative.Linear.MediaFiles.MediaFile.length
      : 1,
    [constants.AdInfoKeys.HIGHEST_RESOLUTION]: highestResolution,
    [constants.AdInfoKeys.LOWEST_RESOLUTION]: lowestResolution,
    [constants.AdInfoKeys.ERROR_TRACKERS]: ad.InLine.Error ? "Yes" : "No",
    [constants.AdInfoKeys.IMPRESSION_TRACKERS]: impressionTrackers.join(", ")
  };
};

const parseWrapper = ad => {
  return {
    [constants.AdInfoKeys.TYPE]: "Wrapper",
    [constants.AdInfoKeys.ERROR_TRACKERS]: ad.Wrapper.Error ? "Yes" : "No",
    [constants.AdInfoKeys.IMPRESSION_TRACKERS]: Array.isArray(
      ad.Wrapper.Impression
    )
      ? ad.Wrapper.Impression.length
      : ad.Wrapper.Impression
      ? 1
      : false
  };
};

module.exports = {
  parseInLine,
  parseWrapper
};
