var express = require('express');
var async = require('async');
var fs = require('fs');
var _ = require('underscore');
var app = module.exports = express();

app.get('/', function(req, res){
  if (!req.query.lat || !req.query.lng){
    return res.status(400).json({
      msg: 'latlng is required'
    });
  }

  var lat = parseFloat(req.query.lat);
  var lng = parseFloat(req.query.lng);

  var num = req.query.num | 10;
  var url;
  var loc = [lat, lng]

  Node.geoNear(loc, {
    maxDistance: 5, //meters
    spherical: true
  }, function(err, nodes){
    if (!nodes){
      return res.status(400).json({
        errcode: 1001,
        errmsg: 'No nodes found in database.'
      });
    }

    if (err){
      return res.status(400).json({
        msg: err
      });
    }
    Edge.geoNear(loc, {
      maxDistance: 5, //meters
      spherical: true
    }, function(err, edges){
      if (!edges){
        return res.status(400).json({
          errcode: 1001,
          errmsg: 'No edges found in database.'
        });
      }

      if (err){
        return res.status(400).json({
          msg: err
        });
      }
      nodes = _.uniq(nodes);
      async.map(nodes, function(node, next){
        var nodeToPass = {
          id: node.obj.id.toString(),
          label: '',
          x: Math.random(),
          y: Math.random(),
          size: node.obj.size
        };
        next(null, nodeToPass);
      }, function(err, retNode) {

        async.map(edges, function(edge, next){
          var edgeToPass = {
            id: edge.obj.id.toString(),
            source: edge.obj.source.toString(),
            target: edge.obj.target.toString(),
          };
          next(null, edgeToPass); 
        }, function(err, retEdge){
          //finish here
          var data = {
            nodes: retNode,
            edges: retEdge
          };

          return res.status(200).json(data);
        });
      });
    });
  });
});
