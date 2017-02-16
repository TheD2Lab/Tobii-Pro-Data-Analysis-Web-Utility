'use strict'

/*
 * Dependencies
 */
 
// internal
var fs = require('fs');
var parse = require('csv-parse/lib/sync');

// external
var Table = require('./table.js');
var Analyzer = require('./analyzer.js');
	

/*
 * Definitions
 */
 
function distance(p1, p2) {
	var dx = p1.x - p2.x;
	var dy = p1.y - p2.y;
	return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}


function values(i) {
	return function(table) {
		return table.records.map(function(row) {
			return parseFloat(row[i]);
		})
	}
}


function pointDistances(arr, dist) {
	if (arr.length == 1) {
		return dist;
	}
	else {
		var p1 = arr[0];
		var p2 = arr[1];
		dist.push(distance(p1, p2));
		return pointDistances(arr.slice(1), dist);
	}
}


function gazePoints(table) {
	
	var xidx = table.index('GazePointX (ADCSpx)');
	var yidx = table.index('GazePointY (ADCSpx)');

	var points = table.records.map(function(r) {
		return { x: r[xidx], y: r[yidx] };
	})

	return pointDistances(points, []);
}


function columns(pred, column) {
	return function(table) {
		var c = table.index(column);
		return table.filter(function(row) {
			return pred(row[c]);
		})
	}
}

/*
 * Run
 */

var data = parse(fs.readFileSync('./data.tsv'), { delimiter: '\t' });
var table = new Table(data);

var analyzers = [];

var rpupil = new Analyzer('Right Pupil',
	columns(function(c) { return c && c !== '-1.00' }, 'PupilRight'), 
	values(table.index('PupilRight')));
analyzers.push(rpupil);

var lpupil = new Analyzer('Left Pupil', 
	columns(function(c) { return c && c !== -1 }, 'PupilLeft'), 
	values(table.index('PupilLeft')));
analyzers.push(lpupil);

var fixDur = new Analyzer('Fixation Duration', 
	columns(function(c) { return c && c === 'Fixation' }, 'GazeEventType'),
	values(table.index('GazeEventDuration')));
analyzers.push(fixDur);
	
var sacDur = new Analyzer('Saccade Duration', 
	columns(function(c) { return c === 'Saccade' }, 'GazeEventType'),
	values(table.index('GazeEventDuration')));
analyzers.push(sacDur);
	 
var sacLength = new Analyzer('Saccade Length', 
	columns(function(c) { return c === 'Fixation' }, 'GazeEventType'),
	gazePoints);
analyzers.push(sacLength);

var relAngle = new Analyzer('Relative Angle',
	columns(function(c) { return c; }, 'RelativeSaccadicDirection'),
	values(table.index('RelativeSaccadicDirection')));
analyzers.push(relAngle);

var absAngle = new Analyzer('Absolute Angle',
	columns(function(c) { return c; }, 'AbsoluteSaccadicDirection'),
	values(table.index('AbsoluteSaccadicDirection')));
analyzers.push(absAngle);
	
	
var response = {};

for (var i = 0; i < analyzers.length; i++) {
	var analyzer = analyzers[i];
	response[analyzer.name] = analyzer.analyze(new Table(data));
	console.log(analyzer.name);
}

console.log(response);



	