const parseInLine = (ad) => {
  const Creative = Array.isArray(ad.InLine.Creatives.Creative) ? ad.InLine.Creatives.Creative[0] : ad.InLine.Creatives.Creative;
  const multiMediaFiles = Creative.Linear.MediaFiles && Array.isArray(Creative.Linear.MediaFiles.MediaFile);
  let highestResolution = !multiMediaFiles ? `${Creative.Linear.MediaFiles.MediaFile["@_width"]}x${Creative.Linear.MediaFiles.MediaFile["@_height"]}` : "";
  let lowestResolution = !multiMediaFiles ? `${Creative.Linear.MediaFiles.MediaFile["@_width"]}x${Creative.Linear.MediaFiles.MediaFile["@_height"]}` : "";
  if (multiMediaFiles) {
    // console.log(Creative.Linear.MediaFiles.MediaFile);
    let highest = 0;
    let lowest = null;
    Creative.Linear.MediaFiles.MediaFile.forEach((m) => {
      let h = Number(m["@_height"]);
      if (h > highest) {
        highestResolution = `${m["@_width"]}x${m["@_height"]}`;
        highest = h;
      }
      if (!lowest || h < lowest) {
        lowestResolution = `${m["@_width"]}x${m["@_height"]}`;
        lowest = h;
      }
    });
  }
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
  // const hours = splittedDuration[0];
  // const minutes = splittedDuration[1];
  // const seconds = splittedDuration[2];

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
