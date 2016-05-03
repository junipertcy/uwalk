require('../env');
var express = require('express');
var async = require('async');
var app = module.exports = express();

polis2network();

function polis2network (callback, count) {
  if (!count) {
    count = 0;
  }

  Polis_participants_vote.find({}).skip(count).limit(10).exec(function(err, ppvs){
    async.mapLimit(ppvs, 1, function(ppv, nextCallback){
      var agreed = [];
      var disagreed = [];
      var moderated = [];
      for (var i = 0; i < 692; i++) {
        if (ppv[i] === 1) {
          agreed.push(i);
        } else if (ppv[i] === -1) {
          disagreed.push(i);
        } else if (ppv[i] === 0) {
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
            nextCallback();
          });
        });
      });
    }, function(){
      count += 10;
      console.log('Finished parsing ', count, 'users!')
      polis2network(callback, count);
    });
  });
}





