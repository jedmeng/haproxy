const { UNIT_TEMP_CELSIUS, UNIT_TEMP_FAHRENHEIT } = require('./const');

exports.formatNumber = function(value, digit = 0, min = undefined, max = undefined) {
  value = parseFloat(value).toFixed(digit || 0);
  value = digit ? parseFloat(value) : parseInt(value);
  value = isNaN(value) ? 0 : value;
  value = min === undefined ? value : Math.max(min, value);
  value = max === undefined ? value : Math.min(max, value);
  return value;
};

exports.ifNull = function(value, newValue) {
  return value === null ? newValue : value;
};

exports.conventTempUnit = function(value, from, to) {
  if (from === to) {
    return value;
  } else if (from === UNIT_TEMP_CELSIUS && to === UNIT_TEMP_FAHRENHEIT) {
    return value * 1.8 + 32;
  } else if (from === UNIT_TEMP_FAHRENHEIT && to === UNIT_TEMP_CELSIUS) {
    return (value - 32) / 1.8;
  } else {
    throw new Error();//@todo
  }
};