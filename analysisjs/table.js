'use strict'

var Table = function(dd) {
	
	var data = dd;
	this.header = data[0];
	this.records = data.slice(1);
	
	var columnMap = this.header.reduce(function(map, elem, i) {
		map[elem] = i;
		return map;
	}, {});
	
	this.print = function() {
		for (var i = 0; i < records.length; i++) {
			for (var j = 0; j < records[0].length; j++) {
				console.log(records[i][j]);
			}	
		}
	}
	
	this.getRow = function(r) {
		return this.records[r];
	}
	
	this.getCol = function(c) {
		return this.records.map(function(row) {
			return row[c];
		})
	}
	
	this.index = function(columnName) {
		console.log('%s\t%d', columnName, columnMap[columnName]);
		return columnMap[columnName];
	};
	
	this.filter = function(pred) {
		this.records = this.records.filter(function(r) {
			return pred(r);
		})
		return this;
	}
	
}


module.exports = Table;

	