/**
 * Flatten the given `object value to array`.
 *
 * @param {Object} object
 * @return {Array}
 * @api private
 */

exports.objectFlatten = function(object, ret){
  ret = ret || [];
  for (var filed in object) {
    if (object[filed] instanceof Object) {
      exports.objectFlatten(object[filed], ret);
    } else {
      ret.push(object[filed]);
    }
  }

  return ret;
};

/**
 * Flatten the given `arr`.
 *
 * @param {Array} arr
 * @return {Array}
 * @api private
 */

exports.flatten = function(arr, ret){
  ret = ret || [];
  var len = arr.length;
  for (var i = 0; i < len; ++i) {
    if (Array.isArray(arr[i])) {
      exports.flatten(arr[i], ret);
    } else {
      ret.push(arr[i]);
    }
  }
  return ret;
};

exports.purifyCSV = function(value) {
  if (!value) return;
  if (typeof value !== 'string') value = value.toString();
  var quoted = value.indexOf('"') >= 0 || value.indexOf(',') >= 0;
  var result = value.replace(/\"/g, '""');

  if (quoted) {
    result = '"' + result + '"';
  }

  return result;
};