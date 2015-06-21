queue()
    .defer(d3.json, "static/geojson/newtable.json")
    .defer(d3.json, "static/geojson/villages.json")
    .await(makeGraphs);

function makeGraphs(error, jsonData, villageJson) {
    var urbCompProj = jsonData;
    var dateFormat = d3.time.format("%Y-%m-%d");

    urbCompProj.forEach(function(d) {
        d["dp"] = dateFormat.parse(d["dp"]);
        d["dp"].setDate(1);
        d["total_duration_level"] = +1;
    });

    var ndx = crossfilter(urbCompProj);

    //create the data dimensions
    var dateDim = ndx.dimension(function(d) { return d["dp"]; });
    var requestTypeDim = ndx.dimension(function(d) { return d["rt"]; });
    var durationLevelDim = ndx.dimension(function(d) { return d["dl"]; });
    var villageDim = ndx.dimension(function(d) { return d["v"]; });
    var totalRequestsDim  = ndx.dimension(function(d) { return d["total_duration_level"]; });

    //create the data groups
    var all = ndx.groupAll();
    var numRequestssByDate = dateDim.group();
    var numRequestsByRequestType = requestTypeDim.group();
    var numRequestsByDurationLevel = durationLevelDim.group();
    var totalRequestsByVillage = villageDim.group().reduceSum(function(d) {
        return d["total_duration_level"];
    });
    var totalRequests = ndx.groupAll().reduceSum(function(d) {return d["total_duration_level"]; });

    //define three values
    var max_village = totalRequestsByVillage.top(1)[0].value;
    var minDate = dateDim.bottom(1)[0]["dp"];
    var maxDate = dateDim.top(1)[0]["dp"];

    //define 6 dc charts
    var timeChart = dc.barChart("#time-chart");
    var resourceTypeChart = dc.rowChart("#resource-type-row-chart");
    var povertyLevelChart = dc.rowChart("#poverty-level-row-chart");
    var tpChart = dc.geoChoroplethChart("#tp-chart");
    var numberProjectsND = dc.numberDisplay("#number-projects-nd");
    var totalRequestsND = dc.numberDisplay("#total-donations-nd");

    //pass the necessary parameters
    numberProjectsND
        .formatNumber(d3.format("d"))
        .valueAccessor(function(d){return d; })
        .group(all);

    totalRequestsND
        .formatNumber(d3.format("d"))
        .valueAccessor(function(d){return d/19864; })
        .group(totalRequests)
        .formatNumber(d3.format(",.1%"));

    timeChart
        .width(600)
        .height(160)
        .margins({top: 10, right: 20, bottom: 30, left: 40})
        .dimension(dateDim)
        .group(numRequestssByDate)
        .transitionDuration(500)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .elasticY(true)
        .xAxisLabel("Time")
        .xUnits(function(){return 25;})
        .yAxis().ticks(4);

    resourceTypeChart
        .width(300)
        .height(350)
        .dimension(requestTypeDim)
        .group(numRequestsByRequestType)
        .elasticX(true)
        .xAxis().ticks(4);

    povertyLevelChart
        .width(300)
        .height(350)
        .dimension(durationLevelDim)
        .group(numRequestsByDurationLevel)
        .elasticX(true)
        .xAxis().ticks(4);

    tpChart
        .width(1000)
        .height(430)
        .dimension(villageDim)
        .group(totalRequestsByVillage)
        .colors(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"])
        .colorDomain([0, max_village])
        .overlayGeoJson(villageJson["features"], "state", function (d) {
            return d.properties.VNAME;
        })
        .projection(d3.geo.albers()
                    .scale(150000)
                    .center([121.572,25.020])
                    .rotate([0,0]));

    dc.renderAll();
};