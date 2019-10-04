const parseInLine = (ad) => {
  const Creative = Array.isArray(ad.InLine.Creatives.Creative) ? ad.InLine.Creatives.Creative[0] : ad.InLine.Creatives.Creative;
  const multiMediaFiles = Creative.Linear.MediaFiles && Array.isArray(Creative.Linear.MediaFiles.MediaFile);
  /**
   * If just a single media file, it's an object instead of an array
   * We want to create a human readable string like 1920x1080 instead of just one single part of the ratio
   */
  let highestResolution = !multiMediaFiles ? `${Creative.Linear.MediaFiles.MediaFile["@_width"]}x${Creative.Linear.MediaFiles.MediaFile["@_height"]}` : "";
  let lowestResolution = !multiMediaFiles ? `${Creative.Linear.MediaFiles.MediaFile["@_width"]}x${Creative.Linear.MediaFiles.MediaFile["@_height"]}` : "";
  /**
   * If multi files, we'll sort to find the one with lowest or highest ratio
   */
  if (multiMediaFiles) {
    const fileList = Creative.Linear.MediaFiles.MediaFile;
    const sortedFiles = fileList.sort((a, b) => a["@_height"] < b["@_height"] ? 1 : -1);
    highestResolution = `${sortedFiles[0]["@_width"]}x${sortedFiles[0]["@_height"]}`;
    lowestResolution = `${sortedFiles[sortedFiles.length - 1]["@_width"]}x${sortedFiles[sortedFiles.length - 1]["@_height"]}`;
  }
  /**
   * We're creating an objext with themes property keys as they will show as titles in the printed table
   */
  return {
    type: "InLine",
    AdSystem: ad.InLine.AdSystem,
    AdTitle: ad.InLine.AdTitle,
    "Duration (seconds)": Creative.Linear.Duration ? durationAsSeconds(Creative.Linear.Duration) : false,
    MediaFiles: multiMediaFiles ? Creative.Linear.MediaFiles.MediaFile.length : 1,
    "Highest resolution": highestResolution,
    "Lowest resolution": lowestResolution,
    ErrorTracker: ad.InLine.Error ? "Yes" : "No",
    ImpressionTrackers: Array.isArray(ad.InLine.Impression) ? ad.InLine.Impression.length
      : ad.InLine.Impression ? 1 : false
  }
};

const parseWrapper = (ad) => {
  return {
    type: "Wrapper",
    ErrorTracker: ad.Wrapper.Error ? "Yes" : "No",
    ImpressionTrackers: Array.isArray(ad.Wrapper.Impression) ? ad.Wrapper.Impression.length
      : ad.Wrapper.Impression ? 1 : false
  };
};

const durationAsSeconds = (adDuration) => {
  let duration = 0;
  const [hours, minutes, seconds] = adDuration.split(":");

  if (Number(hours)) {
    duration += Number(hours) * 3600;
  }
  if (Number(minutes)) {
    duration += Number(minutes) * 60;
  }
  if (Number(seconds)) {
    duration += Number(seconds);
  }

  return duration;
};

module.exports = {
  parseInLine,
  parseWrapper,
  durationAsSeconds
}