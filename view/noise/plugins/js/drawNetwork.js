'use strict';

var drawNetwork = function(lat, lng) {
  $.ajax({
    type: 'GET',
    url: 'http://uwalk.elasticbeanstalk.com/networks',
    data: {
      lng: lng.toString(),
      lat: lat.toString()
    }
  }).done(function(data){
    console.log('network fetched is....');
    console.log(data);
    var i;
    var s;
    var g = {
          nodes: [],
          edges: []
        };

    for (i = 0; i < data.nodes.length; i++){
      g.nodes.push({
        id: data.nodes[i].id,
        label: data.nodes[i].label,
        x: data.nodes[i].x,
        y: data.nodes[i].y,
        size: 0.1,
        color: '#ccc'
      });
    }

    sigma.classes.graph.addMethod('neighbors', function(nodeId) {
      var k,
          neighbors = {},
          index = this.allNeighborsIndex[nodeId] || {};
      for (k in index)
        neighbors[k] = this.nodesIndex[k];
      return neighbors;
    });

    // Instanciate sigma:
    s = new sigma({
      graph: g,
      renderer: {
        container: 'containerNet',
        type: 'canvas',
      },
      settings: {
        doubleClickEnabled: false,
        mouseWheelEnabled: false,
        edgeLabelSize: 'proportional',
        edgeLabelThreshold: 5,
        minEdgeSize: 5
      }
    });

    for (i = 0; i < data.edges.length; i++){
      s.graph.addEdge({
        type: 'curvedArrow',
        id: data.edges[i].id,
        source: data.edges[i].source,
        target: data.edges[i].target,
        size: 10,
        color: '#ccc'
      });
    }

    s.refresh();


    // If numEdges < 75, no need to do clustering, as a known bug of linkurious.js in
    // the pull request list
    var nbPartitions = 1;
    if (s.graph.edges().length >= 75) {
      // Clustering:
      var louvainInstance;

      // Detect communities using the Louvain algorithm:
      louvainInstance = sigma.plugins.louvain(s.graph, {
        setter: function(communityId) {
          this.my_community = communityId;
        }
      });

      var partitions = louvainInstance.getPartitions();

      //Get number of partitions and make them colored
      nbPartitions = louvainInstance.countPartitions(partitions);
    }

    //Create colors
    var colors = Please.make_color({
      colors_returned: nbPartitions,
      golden: true
    });

    // Color nodes based on their community
    s.graph.nodes().forEach(function(n) {
      n.color = colors[n.my_community || 0];
    });

    s.graph.edges().forEach(function(e) {
      e.color = '#bfbfbf';
    });


    s.refresh({
      skipIndexation: true
    });

    s.bind('clickNode', function(e) {
      var nodeId = e.data.node.id;
      var toKeep = s.graph.neighbors(nodeId);
      toKeep[nodeId] = e.data.node;

      s.graph.nodes().forEach(function(n) {
        if (toKeep[n.id])
          n.color = colors[n.my_community];
        else
          n.color = '#eee';
      });
      s.graph.edges().forEach(function(e) {
        if (toKeep[e.source] && toKeep[e.target])
          e.color = e.originalColor;
        else
          e.color = '#eee';
      });
      s.refresh();
    });
    s.bind('clickStage', function(e) {
      s.graph.nodes().forEach(function(n) {
        n.color = colors[n.my_community];
      });

      s.graph.edges().forEach(function(e) {
        e.color = e.originalColor;
      });

      // Same as in the previous event:
      s.refresh();
    });
  //check: https://github.com/Linkurious/linkurious.js/tree/develop/plugins/sigma.layout.forceAtlas2
    var faConfig = {
        worker: true,
        slowDown: 100
    };
    s.startForceAtlas2(faConfig);
    setTimeout(function() {
      s.stopForceAtlas2();
    }, 1000);
  });
}