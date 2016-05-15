require('../env');
var express = require('express');
var async = require('async');
var app = module.exports = express();
var similarity = require( 'compute-cosine-similarity' );
var _ = require('lodash');

polis2timeSimilarity();

function polis2timeSimilarity (callback, count) {
  if (!count) {
    count = 0;
  }

  var iterator = [];
  for (var i = 60; i < 692; i++) {
    for (var j = 0; j < i; j++){
      iterator.push([i, j])
    }
  }
  async.mapLimit(iterator, 10, function(iter, next){
    async.parallel([
      function(cb) {
        Polis_comment.findOne({
          "comment-id": iter[0]
        }, {
          usedTime: 1,
          _id: 0
        }).exec(cb);
      },
      function(cb) {
        Polis_comment.findOne({
          "comment-id": iter[1]
        }, {
          usedTime: 1,
          _id: 0
        }).exec(cb);
      }
    ], function(err, results){
      if (err) {
        return;
      }

      var sArray = [];
      var tArray = [];

      for (var i = 0; i < 15732; i++){
        if (!results[0]["usedTime"] || !results[1]["usedTime"]) {
          break;
        } else {
          if (!results[0]["usedTime"][i]) {
            sArray[i] = 0;
          } else {
            sArray[i] = results[0]["usedTime"][i];
          }

          if (!results[1]["usedTime"][i]) {
            tArray[i] = 0;
          } else {
            tArray[i] = results[1]["usedTime"][i];
          }
        }
      }

      var opinionSimilarity = similarity(sArray, tArray);


      Polis_edge.findOneAndUpdate({
        type: "opinion",
        source: iter[0],
        target: iter[1]
      }, {
        "$set": {
          "weight.timeSim": opinionSimilarity
        }
      }, {
        safe: true,
        upsert: true
      }, function(err){
        if (err) {
          console.log('edge weight update error: ', err);
        }
        console.log('update success: (', iter[0], ',', iter[1], ')');
        next();
      });
    });
  }, function(err) {
    process.exit();
  });
}





