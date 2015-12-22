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
  '<script src="bower_components/mapbox.js/mapbox.js">', '</scr'+'ipt>',
  '<link href="bower_components/mapbox.js/mapbox.css" rel="stylesheet" />',
  //Container switcher
  '<script src="plugins/js/koTools.js">','</scr'+'ipt>',
  //Network container
  '<script src="node_modules/pleasejs/dist/Please.js">','</scr'+'ipt>'].join('');

//div-elements
var custom_infowindow_picHeaders = [
  '       <div class="jcarousel" data-jcarousel="true" data-wrap="circular" id="containerPic" style="display:block; width: 400px; height: 300px">',
  '          <ul>'].join('');

//picUrls: OBTAINED FROM AJAX CALLS
var custom_infowindow_picEndings = [
'            </ul>',
'        <a data-jcarousel-control="true" data-target="-=1" href="#" class="jcarousel-control-prev">&lsaquo;</a>',
'        <a data-jcarousel-control="true" data-target="+=1" href="#" class="jcarousel-control-next">&rsaquo;</a>',
'        </div>'].join('');


var custom_infowindow_checkin =
  '       <div id="containerCheckin" style="display:none; width: 400px; height: 300px"></div>';
var custom_infowindow_network =
  '       <div class="jcarousel" id="containerNet" style="display:none; width: 400px; height: 300px"></div>';

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





