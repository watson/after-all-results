'use strict';

module.exports = function (done) {
  var cbCount = 0;
  var results = [];
  var error;

  return function (callback) {
    var index = cbCount++;
    return function (err, result) {
      if (callback) callback.apply(null, arguments);
      if (err && !error) error = err;
      results[index] = result;
      if (!--cbCount) done(error, results);
    };
  };
};
