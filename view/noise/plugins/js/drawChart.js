/* This script contains functions to draw the noise distribution
 *
 *
 */
'use strict';

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

function draw_chart(year, season, option) {
/**
 * Grid-light theme for Highcharts JS
 * @author Torstein Honsi
 */

  // Load the fonts
  Highcharts.createElement('link', {
     href: '//fonts.googleapis.com/css?family=Dosis:400,600',
     rel: 'stylesheet',
     type: 'text/css'
  }, null, document.getElementsByTagName('head')[0]);

  Highcharts.theme = {
     colors: ["#7cb5ec", "#f7a35c", "#90ee7e", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
        "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
     chart: {
        backgroundColor: null,
        style: {
           fontFamily: "Dosis, sans-serif"
        }
     },
     title: {
        style: {
           fontSize: '16px',
           fontWeight: 'bold',
           textTransform: 'uppercase'
        }
     },
     tooltip: {
        borderWidth: 0,
        backgroundColor: 'rgba(219,219,216,0.8)',
        shadow: false
     },
     legend: {
        itemStyle: {
           fontWeight: 'bold',
           fontSize: '13px'
        }
     },
     xAxis: {
        gridLineWidth: 1,
        labels: {
           style: {
              fontSize: '12px'
           }
        }
     },
     yAxis: {
        minorTickInterval: 'auto',
        title: {
           style: {
              textTransform: 'uppercase'
           }
        },
        labels: {
           style: {
              fontSize: '12px'
           }
        }
     },
     plotOptions: {
        candlestick: {
           lineColor: '#404048'
        }
     },
     // General
     background2: '#F0F0EA'

  };

  // Apply the theme
  Highcharts.setOptions(Highcharts.theme);

  //pass an Array to the year parameter, with length(Array) = 8
  //pass an Array to the season parameter, with length(Array) = 8
  var tableName, seriesDataArray;
  if (option === 0) {
    tableName = 'Spring';
  } else if (option === 1) {
    tableName = 'Summer';
  } else if (option === 2) {
    tableName = 'Fall';
  } else if (option === 3) {
    tableName = 'Winter';
  }

  seriesDataArray = [{
    name: 'Yearly',
    data: year,
    pointPlacement: 'on'
  }];

  if (!!season === true) {
    seriesDataArray.unshift({
      name: tableName,
      data: season,
      pointPlacement: 'on'
    });
  };

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
      ceiling: 1,
      min: -1,
      endOnTick: true
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
    series: seriesDataArray
  });

  console.log('FINISHED!');
}