require('../env');

exports.findVenueHierarchy = function findVenueHierarchy (array, name) {
  if (typeof array !== 'undefined') {
    for (var i = 0; i < array.length; i++) {
      if (array[i].name === name) {
        return [name];
      }
      var a = findVenueHierarchy(array[i].categories, name);
      if (a !== null) {
        a.unshift(array[i].name);
        return a;
      }
    }
  }
  return null;
}