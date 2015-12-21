$(document).ready(function() {

  var active2 = false;
  var active3 = false;
  var active4 = false;

    $('.parent').on('mousedown touchstart', function() {

     if (!active2) $(this).find('.flickr').css({'background-color': 'transparent', 'transform': 'translate(-60px,105px)', 'cursor': 'pointer'});
    else $(this).find('.flickr').css({'background-color': 'transparent', 'transform': 'none'});
      if (!active3) $(this).find('.foursquare').css({'background-color': 'transparent', 'transform': 'translate(-105px,60px)', 'cursor': 'pointer'});
    else $(this).find('.foursquare').css({'background-color': 'transparent', 'transform': 'none'});
      if (!active4) $(this).find('.sn').css({'background-color': 'transparent', 'transform': 'translate(-125px,0px)', 'cursor': 'pointer'});
    else $(this).find('.sn').css({'background-color': 'transparent', 'transform': 'none'});
    active2 = !active2;
    active3 = !active3;
    active4 = !active4;

    });
});