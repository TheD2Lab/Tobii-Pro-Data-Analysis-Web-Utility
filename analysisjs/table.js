'use strict'

var fs = require('fs');
var parse = require('csv-parse/lib/sync');

var Table = function(path) {
	
	var records = records = parse(fs.readFileSync(path), { delimiter: '\t' });
	
	this.print = function() {
		for (var i = 0; i < records.length; i++) {
			for (var j = 0; j < records[0].length; j++) {
				console.log(records[i][j]);
			}	
		}
	}
	
	this.getRow = function(r) {
		return records[r];
	}
	
	this.getCol = function(c) {
		return records.map(function(row) {
			return row[c];
		})
	}
	
}


module.exports = Table;

	