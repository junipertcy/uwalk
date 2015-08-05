/********************************************************
*														*
* 	Step0: Load data from json file						*
*														*
********************************************************/
d3.json("data/dataset.json", function (const_data) {

/********************************************************
*														*
* 	Step1: Create the dc.js chart objects & ling to div	*
*														*
********************************************************/
var bubbleChart = dc.bubbleChart("#dc-bubble-graph");
var pieChart = dc.pieChart("#dc-pie-graph");
var volumeChart = dc.barChart("#dc-volume-chart");
var lineChart = dc.lineChart("#dc-line-chart");
var dataTable = dc.dataTable("#dc-table-graph");
var rowChart = dc.rowChart("#dc-row-graph");

/********************************************************
*														*
* 	Step2:	Run data through crossfilter				*
*														*
********************************************************/
var ndx = crossfilter(const_data);

/********************************************************
*														*
* 	Step3: 	Create Dimension that we'll need			*
*														*
********************************************************/

	var nameDimension = ndx.dimension(function (d) { return d.name; });
	var nameGroup = nameDimension.group();
	console.log(nameGroup);
	var nameDimensionGroup = nameDimension.group().reduce(
		//add
		function(p,v){
			++p.count;
			p.review_sum += v.construction_counts;
			p.lee_const_duration_sum += v.lee_const_durations;
			p.review_avg = p.review_sum / p.count;
			p.lee_const_duration_avg = p.lee_const_duration_sum / p.count;
			return p;
		},
		//remove
		function(p,v){
			--p.count;
			p.review_sum -= v.construction_counts;
			p.lee_const_duration_sum -= v.lee_const_durations;
			p.review_avg = p.review_sum / p.count;
			p.lee_const_duration_avg = p.lee_const_duration_sum / p.count;
			return p;
		},
		//init
		function(p,v){
			return {count:0, review_sum: 0, lee_const_duration_sum: 0, review_avg: 0, lee_const_duration_avg: 0};
		}
	);

	// for volumechart
	var NPURP_labelDimension = ndx.dimension(function (d) { return d.NPURP_label; });
	var NPURP_labelGroup = NPURP_labelDimension.group();
	var NPURP_labelDimensionGroup = NPURP_labelDimension.group().reduce(
		//add
		function(p,v){
			++p.count;
			p.review_sum += v.construction_counts;
			p.lee_const_duration_sum += v.lee_const_durations;
			p.review_avg = p.review_sum / p.count;
			p.lee_const_duration_avg = p.lee_const_duration_sum / p.count;
			return p;
		},
		//remove
		function(p,v){
			--p.count;
			p.review_sum -= v.construction_counts;
			p.lee_const_duration_sum -= v.lee_const_durations;
			p.review_avg = p.review_sum / p.count;
			p.lee_const_duration_avg = p.lee_const_duration_sum / p.count;
			return p;
		},
		//init
		function(p,v){
			return {count:0, review_sum: 0, lee_const_duration_sum: 0, review_avg: 0, lee_const_duration_avg: 0};
		}
	);

	// for pieChart
    var lee_const_durationValue = ndx.dimension(function (d) {
		return d.lee_const_durations*1.0;
    });
    var lee_const_durationValueGroup = lee_const_durationValue.group();

  // for lineChart
    var lee_monthValue = ndx.dimension(function (d) {
		return d.month;
    });
    var lee_monthValueGroup = lee_monthValue.group();


	// For datatable
	var dbDimension = ndx.dimension(function (d) { return d._id; });
/********************************************************
 * 	Step4: Create the Visualizations
 *******************************************************/

 bubbleChart.width(650)
			.height(300)
			.dimension(NPURP_labelDimension)
			.group(NPURP_labelDimensionGroup)
			.transitionDuration(1000)
			.colors(["#ff0000", "#ff4040","#ff7373","#67e667","#39e639","#00cc00"])
			.colorDomain([-12000, 12000])

			.x(d3.scale.linear().domain([0, 5.5]))
			.y(d3.scale.linear().domain([0, 5.5]))
			.r(d3.scale.linear().domain([0, 20000]))
			.keyAccessor(function (p) {
				return p.value.lee_const_duration_avg;
			})
			.valueAccessor(function (p) {
				return p.value.review_avg;
			})
			.radiusValueAccessor(function (p) {
				return p.value.count;
			})
			.transitionDuration(1500)
			.elasticY(true)
			.yAxisPadding(1)
			.xAxisPadding(1)
			.label(function (p) {
				return p.key;
				})
			.renderLabel(true)
			.renderlet(function (chart) {
		        rowChart.filter(chart.filter());
		    })
		    .on("postRedraw", function (chart) {
		        dc.events.trigger(function () {
		            rowChart.filter(chart.filter());
		        });
			  });


pieChart.width(200)
		.height(200)
		.transitionDuration(1500)
		.dimension(lee_const_durationValue)
		.group(lee_const_durationValueGroup)
		.radius(90)
		.minAngleForLabel(0)
		.label(function(d) { return d.data.key; })
		.on("filtered", function (chart) {
			dc.events.trigger(function () {
				if(chart.filter()) {
					console.log(chart.filter());
					volumeChart.filter([chart.filter()-.25,chart.filter()-(-0.25)]);
					}
				else volumeChart.filterAll();
			});
		});

volumeChart.width(230)
            .height(200)
            .dimension(lee_const_durationValue)
            .group(lee_const_durationValueGroup)
			.transitionDuration(1500)
            .centerBar(true)
			.gap(17)
            .x(d3.scale.linear().domain([0.5, 5.5]))
			.elasticY(true)
			.on("filtered", function (chart) {
				dc.events.trigger(function () {
					if(chart.filter()) {
						console.log(chart.filter());
						lineChart.filter(chart.filter());
						}
					else
					{lineChart.filterAll()}
				});
			})
			.xAxis().tickFormat(function(v) {return v;});

//What is this??
//console.log(lee_const_durationValueGroup.top(1)[0].value);

lineChart.width(230)
		.height(200)
		.dimension(lee_monthValue)
		.group(lee_monthValueGroup)
		.x(d3.scale.linear().domain([0.5, 12.5]))
		.valueAccessor(function(d) {
			return d.value;
			})
			.renderHorizontalGridLines(true)
			.elasticY(true)
			.xAxis().tickFormat(function(v) {return v;});	;

rowChart.width(340)
			.height(850)
			.dimension(NPURP_labelDimension)
			.group(NPURP_labelGroup)
			.renderLabel(true)
			.colors(["#ff0000", "#ff4040","#ff7373","#67e667","#39e639","#00cc00"])
			.colorDomain([0, 0])
		    .renderlet(function (chart) {
		        bubbleChart.filter(chart.filter());
		    })
		    .on("filtered", function (chart) {
		        dc.events.trigger(function () {
		            bubbleChart.filter(chart.filter());
		        });
			            });


dataTable.width(800).height(800)
	.dimension(dbDimension)
	.group(function(d) { return "被選上的里們"
	 })
	.size(200)
    .columns([
        function(d) { return d.name; },
        function(d) { return d.NPURP_label; },
        function(d) { return d.lee_const_durations; },
        function(d) { return d.construction_counts; },
				function(d) { return '<a href=\"http://maps.google.com/maps?z=12&t=m&q=loc:' + d.lng + ',' + d.lat +"\" target=\"_blank\">Map</a>"}
    ])
    .sortBy(function(d){ return d.lee_const_durations; })
    // (optional) sort order, :default ascending
    .order(d3.ascending);
/********************************************************
*														*
* 	Step6: 	Render the Charts							*
*														*
********************************************************/

	dc.renderAll();
});
