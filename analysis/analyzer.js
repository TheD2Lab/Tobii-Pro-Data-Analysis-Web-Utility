'use strict'

var Analyzer = function(n, u, f, t) {

	this.name = n;
	this.units = u;
	var filter = f;
	var transform = t;
	function stats(arr) {
	
		var stats = {};		
		
		stats['mean'] = arithmeticMean(arr);
		stats['median'] = median(arr);
		stats['mode'] = mode(arr);
		stats['variance'] = variance(arr);
		stats['stddev'] = standardDeviation(arr);
		stats['sum'] = sum(arr);
		stats['min'] = min(arr);
		stats['max'] = max(arr);
		stats['count'] = arr.length;
		
		return stats;
	}
	
	this.analyze = function(table) {
		this.samples = transform(filter(table)).filter(function(s) { return s.t && s.v; });
		return stats(this.samples.map(function(s) { return s.v; }));
	}
	
	/*
 * Center
 */

	const KEY = 0;
	const VAL = 1;

	var min = function(arr) {
		return Math.min.apply(null, arr);
	}


	var max = function(arr) {
		return Math.max.apply(null, arr);
	}


	var arithmeticMean = function(arr) {
		return sum(arr) / arr.length;
	}


	var geometricMean = function(arr) {
		return prod(arr) / arr.length;
	}


	var harmonicMean = function(arr) {
		console.error('harmonicMean(arr) is not yet implemented.');
	}


	var median = function(arr) {
		var length = arr.length;
		var mid = Math.floor(length / 2);
		return length % 2 == 0 ? arr[mid ] : (arr[mid - 1] + arr[mid]) / 2;
	}


	var mode = function(arr) {

		var freqs = {};
	
		arr.forEach(function(e) {
			if (freqs.hasOwnProperty(e)) {
				var count = freqs[e];
				freqs[e] = ++count;
			}
			else {
				freqs[e] = 1;	
			}
		});

		var counts = Object.entries(freqs);
		var sorted = counts.sort(function(a, b) {
			return a[VAL] < b[VAL];
		});
	
		var maxEntry = sorted[0];
	
		return maxEntry[KEY];
	}


	/*
	 * Dispersion
	 */
	
	var variance = function(arr) {
		var mean = arithmeticMean(arr);
		return (1 / arr.length) * arr.reduce(((agg, curr) =>  agg + Math.pow(curr - mean, 2)), 0); 
	}


	var standardDeviation = function(arr) {
		return Math.sqrt(variance(arr));
	}


	/*
	 * Convenience
	 */
	var sum = function(arr) {
		return arr.reduce((acc, curr) => acc + curr, 0)
	}

	var prod = function(arr) {
		return arr.reduce((acc, curr) => acc * curr, 0)
	}
		
}


module.exports = Analyzer;