var express = require('express');
var async = require('async');
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

  var loc = [lng, lat];

  Node.geoNear(loc, {
    maxDistance: 1000, //meters
    spherical: false,
    limit: 100
  }, function(err, nodes){
    console.log(nodes);
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
      maxDistance: 1000, //meters
      spherical: false,
      limit: 100
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

      nodes = _.map(_.groupBy(nodes, function(obj){
        return obj.obj.id;
      }), function(array){
        return array[0];
      });

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
        var nodeIdList = _.pluck(retNode, 'id');
        async.map(edges, function(edge, next){

          if (!_.contains(nodeIdList, edge.obj.target) || !_.contains(nodeIdList, edge.obj.source)){
            next();
          } else {
            var edgeToPass = {
              id: edge.obj.id.toString(),
              source: edge.obj.source.toString(),
              target: edge.obj.target.toString(),
            };
            next(null, edgeToPass);
          }
        }, function(err, retEdge){
          retEdge = _.compact(retEdge);

          //Clean all the isolated nodes
          var edgeIdList = _.flatten([_.pluck(retEdge, 'source'), _.pluck(retEdge, 'target')]);

          retNode = _.filter(retNode, function(e){
            return _.contains(edgeIdList, e.id);
          });

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
