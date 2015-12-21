'use strict';

var drawNetwork = function(lat, lng) {

  $.ajax({
    type: 'GET',
    url: 'http://uwalk.elasticbeanstalk.com/networks',
    data: {
      lng: -73.8758,
      lat: 40.6941
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
    var colors = [
        '#D6C1B0',
        '#9DDD5A',
        '#D06D34',
        '#D28FD8',
        '#5D8556',
        '#71D4C6',
        '#CDCF79',
        '#D8A836',
        '#5E8084',
        '#738ECD',
        '#D36565',
        '#61DC7B',
        '#9B7168',
        '#97C4DE',
        '#A57E42',
        '#D5DA41',
        '#D06B97',
        '#917097',
        '#689534',
        '#90D59B'
      ];

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
        edgeLabelSize: 'proportional',
        edgeLabelThreshold: 5,
        minEdgeSize: 5
      }
    });

    for (i = 0; i < data.edges.length; i++){
      s.graph.addEdge({
        type: 'arrow',
        id: data.edges[i].id,
        source: data.edges[i].source,
        target: data.edges[i].target,
        size: 10,
        color: '#ccc'
      });
    }

    s.refresh();


    // Clustering:
    var louvainInstance;
    // Detect communities using the Louvain algorithm:
    louvainInstance = sigma.plugins.louvain(s.graph, {
      setter: function(communityId) { this.my_community = communityId; }
    });
    var nbLevels = louvainInstance.countLevels();
    var partitions = louvainInstance.getPartitions();
    var nbPartitions = louvainInstance.countPartitions(partitions);

    // Color nodes based on their community
    s.graph.nodes().forEach(function(node) {
      node.color = colors[node.my_community];
    });
    s.refresh({skipIndexation: true});

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
    }, 2000);

  });

}