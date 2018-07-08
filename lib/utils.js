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