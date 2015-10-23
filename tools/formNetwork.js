require('./env');
var fs = require('fs');
var _ = require('underscore');
var async = require('async');
var mongoose = require('mongoose');

var jsonArray;

var files = fs.readdirSync('./induced_subgraph');

for (var j = 0; j < files.length; j++) {
	var file = files[j];
	console.log('Focusing on ' + file + '...');

	var extension = file.substr(file.length - 4);
	if (extension === '.csv') {
		var corners = file.substring(0, file.length - 4).split(',');
		var leftBottom = [];
		var rightBottom = [];
		var rightTop = [];
		var leftTop = [];
		var coordinate = [];
		var coordinatesArray = [];
		var newDataArray = [];
		var count;
		var type;
		var lngMean = (parseFloat(corners[1]) + parseFloat(corners[2]))/2;
	  var latMean = (parseFloat(corners[0]) + parseFloat(corners[3]))/2;

		leftBottom.push(parseFloat(corners[1]));
	  leftBottom.push(parseFloat(corners[0]));

	  rightBottom.push(parseFloat(corners[2]));
	  rightBottom.push(parseFloat(corners[0]));

	  rightTop.push(parseFloat(corners[2]));
	  rightTop.push(parseFloat(corners[3]));

	  leftTop.push(parseFloat(corners[1]));
	  leftTop.push(parseFloat(corners[3]));

	  coordinate.push(leftBottom);
	  coordinate.push(rightBottom);
	  coordinate.push(rightTop);
	  coordinate.push(leftTop);
		



	  coordinatesArray.push(coordinate);

	  var array = [];
		var fileContents = fs.readFileSync('./induced_subgraph/' + file);

		fileContents.toString().split(' ')[0].split('\n').forEach(function(e){
  		array.push(e.split('\t'));
		});
		
		// async.map(array, function(arr, next){
		// 	if (arr.length === 2) {
		// 		Edge.findOneAndUpdate({
		// 				type : 'Feature',
		// 				'geometry.type': 'Polygon',
		// 				'geometry.coordinates': coordinatesArray,
		// 				center: [lngMean, latMean],
		// 				source: arr[0].toString(),
		// 				target: arr[1].toString()
		// 			}, {

		// 			}, {
		// 				upsert: true,
		// 				safe: true
		// 			}).exec(function(err, edge){
		// 				if (err){
		// 					console.log(err);
		// 				}
		// 				next();
		// 			});
		// 		} else {
		// 			next();
		// 		}
		// }, function(err, arrResult){
		// 	console.log('update all edges finished');
		// });



		var arrayUniq = _.uniq(_.compact(_.flatten(array)));
		for (var k = 0; k < arrayUniq.length; k++){
			Node.findOneAndUpdate({
				type : 'Feature',
				'geometry.type': 'Polygon',
				'geometry.coordinates': coordinatesArray,
				center: [lngMean, latMean],
				id: arrayUniq[k].toString() || ''
			}, {
				$inc: {
					size: +1
				}
			}, {
				upsert: true,
				safe: true
			}).exec(function(err){
				if (err) {
					console.log(err);
				}
				
			});
		}
	}			
} 
