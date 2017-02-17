'use strict'

// internal
var fs = require('fs');
var parse = require('csv-parse/lib/sync');
var ch = require('convex-hull');

// external
var Table = require('./table.js');
var Analyzer = require('./analyzer.js');

module.exports = function(tsv) {
	
	/*
	 * Definitions
	 */
 
	function validity(table) {

		var vl = table.index('ValidityLeft');
		var vr = table.index('ValidityRight');

		var oldLength = table.records.length;
		var filtered = table.records.filter(function(row) {
			return row[vl] === '0' && row[vr] === '0';
		})
	
		var newLength = filtered.length;

		return newLength / parseFloat(oldLength) ;
	}


	function duration(table) {
	
		var times = table.getCol(table.index('EyeTrackerTimestamp'));
	
		var t0 = new Date(times[0] / 1000);
		var tn = new Date(times[times.length - 1] / 1000);
	
		return (tn - t0) / 1000;
	}


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


	function extractPoints(table) {
	
		var xidx = table.index('GazePointX (ADCSpx)');
		var yidx = table.index('GazePointY (ADCSpx)');

		return table.records.filter(function(r) {
				return r[xidx] !== '' && r[yidx] !== '';
			}).map(function(r) {
			return { x: parseInt(r[xidx]), y: parseInt(r[yidx]) };
		})
	}


	function gazePoints(table) {
		return pointDistances(extractPoints(table), []);
	}


	function columns(pred, column) {
		return function(table) {
			var c = table.index(column);
			return table.filter(function(row) {
				return pred(row[c]);
			})
		}
	}


	function convexHullData(table) {
	
		var points = extractPoints(table);
	
		var hullPoints = ch(points.map(function(p) { return [ p.x, p.y ]; }));
		var hullArea = polygonArea(hullPoints);
	
	
		return {
			'points' : points,
			'hullPoints': hullPoints.map(function(p) { return { x: p[0], y: p[1] }; }),
			'area' : hullArea
		}
	}


	function polygonArea(points) {
	
		var area = 0.0;	
		var n = points.length;
		var j = 0;
	
		for (var i = 0; i < n; i++) {
			j = (i + 1) % n;
			area += points[i][0] * points[j][1];
			area += points[j][0] * points[i][1];
		}
	
		return area / 2;
	}

	/*
	 * Run
	 */
	 
	var data = parse(tsv, { delimiter: '\t' });
	var table = new Table(data);

	var response = { 
		'status' : 'success',
		'data' : {}
	};

	var metadata = {
		'validity' : validity(table),
		'duration' : duration(table)
	}

	response['data']['metadata'] = metadata;
	response['data']['measures'] = {};

	var analyzers = [];

	var rpupil = new Analyzer('Right Pupil', 'mm',
		columns(function(c) { return c && c !== '-1.00' }, 'PupilRight'), 
		values(table.index('PupilRight')));
	analyzers.push(rpupil);

	var lpupil = new Analyzer('Left Pupil', 'mm',
		columns(function(c) { return c && c !== -1 }, 'PupilLeft'), 
		values(table.index('PupilLeft')));
	analyzers.push(lpupil);

	var fixDur = new Analyzer('Fixation Duration', 'ms',
		columns(function(c) { return c && c === 'Fixation' }, 'GazeEventType'),
		values(table.index('GazeEventDuration')));
	analyzers.push(fixDur);
	
	var sacDur = new Analyzer('Saccade Duration', 'ms',
		columns(function(c) { return c === 'Saccade' }, 'GazeEventType'),
		values(table.index('GazeEventDuration')));
	analyzers.push(sacDur);
	 
	var sacLength = new Analyzer('Saccade Length', 'px',
		columns(function(c) { return c === 'Fixation' }, 'GazeEventType'),
		gazePoints);
	analyzers.push(sacLength);

	var relAngle = new Analyzer('Relative Angle', 'degrees',
		columns(function(c) { return c; }, 'RelativeSaccadicDirection'),
		values(table.index('RelativeSaccadicDirection')));
	analyzers.push(relAngle);

	var absAngle = new Analyzer('Absolute Angle', 'degrees',
		columns(function(c) { return c; }, 'AbsoluteSaccadicDirection'),
		values(table.index('AbsoluteSaccadicDirection')));
	analyzers.push(absAngle);
	
	var convexHull = convexHullData(new Table(data));
	response['data']['measures']['Fixation Hull'] = convexHull;

	for (var i = 0; i < analyzers.length; i++) {
		var analyzer = analyzers[i];
		var measure = {};
		measure['name'] = analyzer.name;
		measure['stats'] = analyzer.analyze(new Table(data));
		measure['units'] = analyzer.units;
		measure['samples'] = analyzer.samples;
		response['data']['measures'][analyzer.name] = measure;
	}

	console.log(JSON.stringify(response, null, 2));

	return response;
};
	