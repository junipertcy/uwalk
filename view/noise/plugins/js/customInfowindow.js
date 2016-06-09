/* The part is for setting up the custom infowindow
 *
 *
 */
'use strict';

var custom_infowindow_headers = [
	//header and close-buttom
  '<div class="cartodb-popup header with-image v2" height="300" data-cover="true">',
  '<a href="#close" class="cartodb-popup-close-button close">x</a>'].join('');

//scripts
var custom_infowindow_scripts = [

  '<link href="plugins/css/ny_licenses.css" rel="stylesheet">',
  '<link href="plugins/css/map.css" rel="stylesheet">',
  //Picture container
  '<script src="bower_components/jquery-menu/src/js/jquery.menu.js">','</scr'+'ipt>',
  '<script src="plugins/js/drawChart.js"></scr'+'ipt>',
  '<script src="bower_components/jcarousel/dist/jquery.jcarousel.min.js"></scr'+'ipt>',
  '<script src="bower_components/jcarousel/examples/data-attributes/jcarousel.data-attributes.js">','</scr'+'ipt>',
  '<script src="bower_components/knockout/dist/knockout.js">','</scr'+'ipt>',
  //Checkin container
  //Container switcher
  '<script src="plugins/js/koTools.js">','</scr'+'ipt>'].join('');

//div-elements
var custom_infowindow_picHeaders = [
  '       <div class="jcarousel" data-jcarousel="true" data-wrap="circular" id="containerPic" style="display:none; width: 400px; height: 300px">',
  '          <ul>'].join('');

//picUrls: OBTAINED FROM AJAX CALLS
var custom_infowindow_picEndings = [
'            </ul>',
'        <a data-jcarousel-control="true" data-target="-=1" href="#" class="jcarousel-control-prev">&lsaquo;</a>',
'        <a data-jcarousel-control="true" data-target="+=1" href="#" class="jcarousel-control-next">&rsaquo;</a>',
'        </div>'].join('');


var custom_infowindow_checkin =
  '       <div id="containerCheckin" style="display:none; width: 400px; height: 300px">' +
  '</div>';
var custom_infowindow_network =
  '       <div id="containerNet" style="display:block; width: 400px; height: 300px">' +
  '</div>';

var custom_infowindow_transitions = [
//icons for transitions (calling knockout.js here)
'<div class="parent">',
	'<div class="flickr">',
		'<button id="flickrTr" class="fa fa-flickr fa-2x"></button>',
	'</div>',

	'<div class="foursquare">',
		'<button id="foursquareTr" class="fa fa-foursquare fa-2x"></button>',
	'</div>',

	'<div class="sn">',
		'<button id="snTr" class="fa fa-users fa-2x"></button>',
	'</div>',

'<div class="mask2">',
'<i class="fa fa-bars fa-2x"></i>',
'</div>',
'</div>'].join('');

var custom_infowindow_endings = [
//endings
'  <div class="cartodb-popup-content-wrapper" id="container" style="min-width: 400px; max-width: 400px; height: 300px; margin: 0 auto">',
'    <div class="cartodb-popup-content">',
'    </div>',
'  </div>',
'<div class="cartodb-popup-tip-container"></div>',
'</div>'].join('');


var infoWindow = function (latlng, callback) {
      //use sql to get some part of data
      //Select yearly data

      var loc = latlng.toString().split(',').map(Number);
      $.get('http://uwalk.us-west-1.elasticbeanstalk.com/pictures?lat=' + loc[0] +'&lng=' + loc[1], function(dataPic){
        drawMap(loc[0], loc[1]);
        drawNetwork(loc[0], loc[1]);

        var picUrl = '';
        if (dataPic.msg) {
          $.each(dataPic.msg, function(i) {
            var imgurl = dataPic.msg[i];
            var url = '<li style="width: 400px; height: 300px"><img src="' +
              imgurl +
              '" width="400" height="300" alt=""></li>';
            picUrl = picUrl + url;
            return i < 10;
          });

          custom_infowindow =
            custom_infowindow_headers +
            custom_infowindow_scripts +

            custom_infowindow_picHeaders +
            picUrl +
            custom_infowindow_picEndings +

            custom_infowindow_checkin +
            custom_infowindow_network +

            custom_infowindow_transitions +
            custom_infowindow_endings;

          // for (var s = 0; s <= 3; s++) {
          //   subLayer[season].infowindow.set({
          //     template: custom_infowindow,
          //     sanitizeTemplate: true,
          //     width: 400,
          //     maxHeight: 700
          //   });
          // }
          return callback(null, custom_infowindow);
        }
      });
    }


