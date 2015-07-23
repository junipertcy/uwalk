/*!
 * express-csv
 * Copyright(c) 2014 Qiao Lin
 * MIT Licensed
 */

 /**
   * Module dependencies.
   */

var utils = require('./utils');
var separator = ',';

function expressCSV() {

	return function(_, res, next) {
		if (typeof next !== 'function') {
      	next = function() {};
    	}

    	res.csv = function(array) {
    		var val = array;
    		var csv = '';

    		if(arguments.length === 2) {
    			// res.csv(array, status) backwards compat
    			if (typeof arguments[1] === 'number') {
      				this.statusCode = arguments[1];
    			} else {
      				this.statusCode = arguments[0];
      				val = arguments[1];
    			}
    		}

    		if (!Array.isArray(val)) {
    			return next(new Error('res.csv data type required to be Array, abord.'));
    		}

    		//content-type
    		this.setHeader('Content-Type', 'text/csv');
    		this.charset = this.charset || 'utf-8';
    		this.setHeader('Content-Disposition', 'attachment; filename=' + 'export.csv');

    		val.forEach(function(item) {
    			if (item instanceof Object) {
    				item = utils.objectFlatten(item);
    			} else if (item instanceof Array) {
    				item = utils.flatten(item);
    			} else {
                    return;
                }

    			csv += item.map(utils.purifyCSV).join(separator) + '\r\n';
    		});

    		return this.send(csv);
    	};

        next();
	}
}

module.exports = expressCSV;