'use strict';

var test = require('tape');
var aar = require('./');

var async = function (callback) {
  process.nextTick(function () {
    callback();
  });
};

test('should call the callback when all async stuff is done', function (t) {
  var next = aar(function (err, results) {
    t.error(err);
    t.equal(results.length, 2);
    t.end();
  });
  async(next());
  async(next());
});

test('should pass on arguments to nested callbacks', function (t) {
  var next = aar(function (err, results) {
    t.end();
  });
  var cb = next(function (a1, a2, a3) {
    t.equal(a1, 1);
    t.equal(a2, 2);
    t.equal(a3, 3);
  });
  process.nextTick(cb.bind(null, 1, 2, 3));
});

test('should call the callback with the first error after all async stuff is done', function (t) {
  var next = aar(function (err, results) {
    t.equal(err.message, 'first');
    t.equal(results.length, 2);
    t.end();
  });

  setTimeout(next().bind(null, new Error('second')), 20);
  setTimeout(next().bind(null, new Error('first')), 10);
});
