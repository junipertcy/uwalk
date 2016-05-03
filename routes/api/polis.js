var express = require('express');
var async = require('async');
var fs = require('fs');
var _ = require('underscore');
var app = module.exports = express();
var moment = require('moment');


app.get('/', function(req, res){
  Polis_participants_vote.find({}).limit(1).exec(function(err, ppvs){
    var agreed = [];
    var disagreed = [];
    var moderated = [];
    for (var i = 0; i < 692; i++) {
      if (ppvs[0][i] === 1) {
        agreed.push(i);
      } else if (ppvs[0][i] === -1) {
        disagreed.push(i);
      } else if (ppvs[0][i] === 0) {
        moderated.push(i);
      }
    }

    var iterator = {};
    iterator.agreed = [];
    iterator.disagreed = [];
    iterator.moderated = [];

    for (var i = 0; i < agreed.length; i++) {
      for (var j = 0; j < i; j++) {
        iterator.agreed.push([agreed[i], agreed[j]]);
      }
    }
    for (var i = 0; i < disagreed.length; i++) {
      for (var j = 0; j < i; j++) {
        iterator.disagreed.push([disagreed[i], disagreed[j]]);
      }
    }
    for (var i = 0; i < moderated.length; i++) {
      for (var j = 0; j < i; j++) {
        iterator.moderated.push([moderated[i], moderated[j]]);
      }
    }

    async.mapLimit(iterator.agreed, 1, function(i_agree, next){
      Polis_edge.findOneAndUpdate({
        type: "opinion",
        source: i_agree[0],
        target: i_agree[1]
      }, {
        "$inc": {
          "weight.agree": 1
        }
      }, {
        upsert: true
      }, function(){
        next();
      });
    }, function(){
      console.log('agree-opinions parse finished!');
      async.mapLimit(iterator.disagreed, 1, function(i_disagree, next){
        Polis_edge.findOneAndUpdate({
          type: "opinion",
          source: i_disagree[0],
          target: i_disagree[1]
        }, {
          "$inc": {
            "weight.disagree": 1
          }
        }, {
          upsert: true
        }, function(){
          next();
        });
      }, function(){
        console.log('disagree-opinions parse finished!');
        async.mapLimit(iterator.moderated, 1, function(i_moderate, next){
          Polis_edge.findOneAndUpdate({
            type: "opinion",
            source: i_moderate[0],
            target: i_moderate[1]
          }, {
            "$inc": {
              "weight.moderate": 1
            }
          }, {
            upsert: true
          }, function(){
            next();
          });
        }, function(){
          console.log('moderate-opinions parse finished!');
          return res.status(200).json({
            status: "done!"
          });
        });
      });
    });
  });
});

