// create layer selector
function createSelector(layer) {
  var sql = new cartodb.SQL({ user: 'junipertcy' });
  var $options = $('#layer_selector li');
  $options.click(function(e) {
    // get the count of the selected layer
    var $li = $(e.target);
    var count = $li.attr('data');
    // deselect all and select the clicked one
    $options.removeClass('selected');
    $li.addClass('selected');
    // create query based on data from the layer
    var query = 'select * from test_3';
    if(count !== 'all') {
      query = 'select * from test_3 where count > ' + count;
    }
    // change the query in the layer to update the map
    layer.setSQL(query);
  });
}

function toPercent(array){
  var total = array.reduce(function(a, b) {
    return a + b;
  });

  var ret = [];
  array.forEach(function(e){
    ret.push(e/total);
  });

  return ret;
}

function draw_chart(year, season) {
  //pass an Array to the year parameter, with length(Array) = 8
  //pass an Array to the season parameter, with length(Array) = 8

  $('#container').highcharts({
    exporting: {
      enabled: false
    },
    chart: {
      polar: true,
      type: 'line'
    },
    title: {
      text: 'Grid Noise Details',
      x: 0,
      style: {
        fontSize: '14px',
        fontWeight: 'bold'
      }
    },
    pane: {
      size: '85%',
      center: ['60%', '50%']
    },
    xAxis: {
      categories: ['Loud Music/Party', 'Vehicle', 'Construction', 'Banging/Pounding', 'AC/Ventolation', 'Loud Talking','Manufacturing', 'Alarms', 'Others'],
      tickmarkPlacement: 'on',
      lineWidth: 0
    },
    yAxis: {
      gridLineInterpolation: 'polygon',
      lineWidth: 0,
      startOnTick: true,
      endOnTick: false
    },
    tooltip: {
      shared: true,
      pointFormat: '<span style="color:{series.color}">{series.name}: <b>' +'{point.y:.3f}</b><br/>'
    },
    legend: {
      align: 'right',
      verticalAlign: 'top',
      x: 15,
      y: 30,
      layout: 'vertical'
    },
    series: [{
      name: 'Spring',
      data: season,
      pointPlacement: 'on'
    }, {
      name: 'Yearly',
      data: year,
      pointPlacement: 'on'
    }]
  });
}


//The part is for setting up the custom infowindow
var custom_infowindow_order_1 = [
  '<div class="cartodb-popup header with-image v2" height="300" data-cover="true">',
  '<a href="#close" class="cartodb-popup-close-button close">x</a>',
  '<script src="bower_components/jcarousel/examples/data-attributes/jcarousel.data-attributes.js">',
  '</scr'+'ipt>',
  '<script src="bower_components/jquery-menu/src/js/jquery.menu.js">',
  '</scr'+'ipt>',
  '       <div class="jcarousel" data-jcarousel="true" data-wrap="circular" style="width: 400px; height: 300px">',
  '          <ul>'].join('');

var custom_infowindow_order_2 = [
'            </ul>',
'        </div>',
'        <a data-jcarousel-control="true" data-target="-=1" href="#" class="jcarousel-control-prev">&lsaquo;</a>',
'        <a data-jcarousel-control="true" data-target="+=1" href="#" class="jcarousel-control-next">&rsaquo;</a>',
//The part is for setting up the icons
'<div class="parent">',
'<div class="flickr">',
'<i class="fa fa-flickr fa-2x"></i>',
'</div>',

'<div class="foursquare">',
'<i class="fa fa-foursquare fa-2x"></i>',
'</div>',

'<div class="sn">',
'<i class="fa fa-users fa-2x"></i>',
'</div>',

'<div class="mask2">',
'<i class="fa fa-bars fa-2x"></i>',
'</div>',
'</div>',


'  <div class="cartodb-popup-content-wrapper" id="container" style="min-width: 400px; max-width: 400px; height: 300px; margin: 0 auto">',
'    <div class="cartodb-popup-content">'].join('');

var custom_infowindow_order_3 = [
'    </div>',
'  </div>',
'<div class="cartodb-popup-tip-container"></div>',
'</div>'
].join('');