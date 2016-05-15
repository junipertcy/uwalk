require('../env');
var express = require('express');
var async = require('async');
var app = module.exports = express();
var similarity = require( 'compute-cosine-similarity' );
var _ = require('lodash');

polis2time();

function polis2time (callback, voter_id) {

  if (!voter_id) {
    voter_id = 0
  }

  Polis_vote.find({
    "voter-id": voter_id
  }, {
    "comment-id": 1,
    "timestamp": 1,
    "_id": 0
  }).sort({
    "timestamp": 1
  }).exec(function(err, votes){
    var timeOrderedVotes = votes;
    var votesTimeList = [];
    for (var i = 0; i < timeOrderedVotes.length - 1; i++) {
      var opinion = timeOrderedVotes[i+1]["comment-id"];
      var elapsedTime = timeOrderedVotes[i + 1]["timestamp"] - timeOrderedVotes[i]["timestamp"];

      votesTimeList.push([opinion, elapsedTime]);
    }

    async.mapLimit(votesTimeList, 1, function(voteTimeItem, next) {
      Polis_comment.findOne({
        "comment-id": voteTimeItem[0]
      }).exec(function(err, comment){
        if (err) {
          console.log(err);
        }
        if (!comment["usedTime"]) {
          comment["usedTime"] = {};
        }

        comment["usedTime"][voter_id] = voteTimeItem[1];

        Polis_comment.findOneAndUpdate({
          "comment-id": voteTimeItem[0]
        }, {
          "$set": comment
        }, {
          safe: true,
          upsert: false
        }, function(){
          console.log('update comment-id: ', voteTimeItem[0], ' voted by voter-id: ', voter_id, 'with usedTime: ', voteTimeItem[1], ' finished!');
          next();
        });
      });
    }, function(err){
      if (voter_id === 15732) { //max: 15732
        console.log("finished!!");
        process.exit();
      }
      voter_id += 1;
      polis2time(callback, voter_id);
    });
  })
}





