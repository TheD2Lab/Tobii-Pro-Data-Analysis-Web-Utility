'use strict'

const DESCRIPTIVE_STATS = 'DescriptiveStats';

$('#uploadForm').submit(function(e) {

	e.preventDefault();
	
	$.ajax({
			url: '/uploads',
			type: 'POST',
			success: function(data) {
				showResults(data);
			},
			data: new FormData($(this)[0]),
			processData: false,
			contentType: false
	})
})

const TABLE_KEYS = [
	'metric', 
	'mean', 
	'median', 
	'mode', 
	'standard deviation', 
	'variance', 
	'sum', 
	'min',
	'max'
];

function showResults(response) {

	console.log(response);
	
	// Filter response data to construct tables.
	var tableData = {};
	
	for (var category in response) {
		var metrics = response[category];
		var categoryStats = [];
		for (var metric in metrics) {
			var measures = metrics[metric];
			if (measures.hasOwnProperty(DESCRIPTIVE_STATS)) {
				var stats = measures[DESCRIPTIVE_STATS];
				stats['metric'] = metric;
				categoryStats.push(stats);
			}
		}
		tableData[category] = categoryStats;
	}

	console.log(tableData);
	
	
 	var tables = d3.select('#resultContainer')
 		.selectAll('table')
 		.data(Object.keys(tableData))
 		.enter()
 		.append('table');
 		
	tables
		.append('thead')
		.append('tr')
		.selectAll('th')
		.data(TABLE_KEYS)
		.enter()
		.append('th')
		.html(function (d) { return d; });
	
	tables
		.append('tbody')
		.selectAll('tr')
		.data(function(d) { return tableData[d]; })
		.enter()
		.append('tr')
		.selectAll('td')
		.data(function(d) { 
			var data = [];
			for (var i = 0; i < TABLE_KEYS.length; i++) {
				data[i] = d[TABLE_KEYS[i]];
			}
			return data;
		})
		.enter()
		.append('td')
		.html(function (d, i) { 
			return i == 0 ? d : d3.format('.2f')(d);
		});
}


$("#validitySlider").slider({
	min: 0,
	max: 4,
	step: 1
});

$("#timeSlider").slider({
	min: 0,
	max: 4,
	step: 1
});

$("#eventSlider").slider({
	min: 0,
	max: 4,
	step: 1
});