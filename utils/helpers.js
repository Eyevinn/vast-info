const get = (obj, path, defaultValue) => {
  const result = String.prototype.split
    .call(path, /[,[\].]+?/)
    .filter(Boolean)
    .reduce(
      (res, key) => (res !== null && res !== undefined ? res[key] : res),
      obj
    );
  return result === undefined || result === obj ? defaultValue : result;
};

const durationAsSeconds = adDuration => {
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
  get,
  durationAsSeconds
};
