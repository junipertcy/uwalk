require('../env');
var express = require('express');
var async = require('async');
var app = module.exports = express();
var similarity = require( 'compute-cosine-similarity' );
var _ = require('lodash');

polis2similarity();

function polis2similarity (callback, count) {
  if (!count) {
    count = 0;
  }

  var iterator = [];
  for (var i = 144; i < 692; i++) {
    for (var j = 0; j < i; j++){
      iterator.push([i, j])
    }
  }

  var iteratorLength = iterator.length;
  async.mapLimit(iterator, 10, function(obj, next){
    var s = obj[0];
    var t = obj[1];
    async.parallel([
      function(cb) {
        var query_s = {};
        query_s._id = 0;
        query_s[s] = 1;
        Polis_participants_vote.find({}, query_s).exec(cb);
      },
      function(cb) {
        var query_t = {};
        query_t._id = 0;
        query_t[t] = 1;
        Polis_participants_vote.find({}, query_t).exec(cb);
      }
    ], function(err, results){
      if (err) {
        return;
      }

      function getValue(d, i, j) {
        if (j === 0) {
          return d[s];
        } else if (j === 1) {
          return d[t];
        }
      }

      var opinionSimilarity = similarity(results[0], results[1], getValue);

      Polis_edge.findOneAndUpdate({
        type: "opinion",
        source: s,
        target: t
      }, {
        "$set": {
          "weight.similarity": opinionSimilarity
        }
      }, {
        safe: true,
        upsert: true
      }, function(err){
        if (err) {
          console.log('edge weight update error: ', err);
        }
        console.log('update success: (', s, ',', t, ')');
        next();
      });
    });
  }, function(err) {
    process.exit();
  });
}





