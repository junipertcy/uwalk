'use strict';
//'<script src="bower_components/mapbox.js/mapbox.js">', '</scr'+'ipt>',
//'<script src="bower_components/jquery/dist/jquery.min.js">', '</scr' + 'ipt>',

var drawMap = function(lat, lng) {
  $.getScript('bower_components/mapbox.js/mapbox.js', function(){
    L.mapbox.accessToken = 'pk.eyJ1IjoianVuaXBlcnRjeSIsImEiOiJvOFg5WFVjIn0.7NDB1oOLpq3A5qO7vLaQSA';
    var containerCheckin = L.mapbox.map('containerCheckin', 'mapbox.emerald').setView([lat, lng], 15);

    // Keep our place markers organized in a nice group.
    var foursquarePlaces = L.layerGroup().addTo(containerCheckin);

    $.ajax({
      type: 'GET',
      url: 'http://uwalk.us-west-1.elasticbeanstalk.com/checkins',
      data: {
        lng: lng.toString(),
        lat: lat.toString()
      }
    }).done(function(data){

      // Transform each venue data into a marker on the map.
      for (var i = 0; i < data.data.length; i++) {
        var venue = data.data[i];
        var latlng = L.latLng(venue.obj.location.lat, venue.obj.location.lng);

        L.marker(latlng, {
          icon: L.icon({
            'iconUrl': venue.icon,
            'iconSize': [32, 32],
            'shadowSize': [32, 50],
            'marker-size': 'large'
          })
        })
        .bindPopup('<strong><a href="https://foursquare.com/v/' + venue.obj.categories.id + '">' + venue.obj.location.name + '</a></strong>')
        .addTo(foursquarePlaces);
      }
    });
  });
}
