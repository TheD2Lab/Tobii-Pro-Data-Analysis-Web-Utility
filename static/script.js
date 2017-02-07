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
	
	parseResponse(response);
	
		$('html, body').animate( {
			scrollTop: $('#resultContainer').offset().top
		}, 500);
}

function parseResponse(res) {

	appendMeasuresOfSearch(res);
	
	appendMeasuresOfProcessing(res);
	
	appendMeasuresOfCognition(res);
	
	appendRawMeasures(res);
	
}

function appendMeasuresOfSearch(res) {

	var fixCount = res[FIXATION][COUNT];
	var sacCount = res[SACCADE][COUNT];
	var avgSacLength = res[SACCADE][STATS][MEAN];
	var scanLength = res[SACCADE][STATS][SUM];
	var hullArea = res[FIXATION][HULL][AREA];
	
	var searchBox = d3.select('#searchMeasureBox');
	searchBox.select('#fixCount').html(fixCount);
	serachBox.select('#sacCount').html(sacCount);
	searchBox.select('#avgSacLength').html(avgSacLength);
	searchBox.select('#scanLength').html(scanLength);
	searchBox.select('#hullArea').html(hullArea);	
}

function appendRawMeasures(response) {

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
 		.selectAll('.tableBounds')
 		.data(Object.keys(tableData))
 		.enter()
 		.append('div')
 		.attr('class', 'tableBounds')
 		.append('table');
 		
	tables
		.append('caption')
		.text(function(d) { return d; });
	
	tables
		.append('thead')
		.append('tr')
		.selectAll('th')
		.data(TABLE_KEYS)
		.enter()
		.append('th')
		.style('text-align', 'center')
		.style('border-left', function(d, i) { return getCellBorderLeft(i); })
		.html(function (d) { return d; });
	
	tables
		.append('tbody')
		.selectAll('tr')
		.data(function(d) { return tableData[d]; })
		.enter()
		.append('tr')
		.style('border-top', '1px solid white')
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
		.style('border-left', function(d, i) { return i == 0 ? 'none' : '1px solid white' })
		.style('text-align', function(d, i) { return getCellAlignment(i); })
		.style('font-style', function(d, i) { return i == 0 ? 'italic' : 'normal'; })
		.html(function (d, i) { 
			return i == 0 ? d : d3.format('.2f')(d);
		});
		
}

function getCellAlignment(i) {
	return i == 0 ? 'center' : 'right';
}

function getCellBorderLeft(i) {
	return i == 0 ? 'none' : '1px solid white';
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

var axisHeight = 20;

var graphPadding = 20;
var boxW = d3.select('.measBox').node().getBoundingClientRect().width;
var bodyW = d3.select('.measText').node().getBoundingClientRect().width;

var height = d3.select('.measText').node().getBoundingClientRect().height;
var width = d3.select('.measGraph').node().getBoundingClientRect().width	 - 20;


var data = d3.range(1000).map(d3.randomBates(10));

var formatCount = d3.format('.0f');

var svg = d3.select('#searchGraph')
	.attr('width', width)
	.attr('height', height);

var graphHeight = height - axisHeight;
var graphWidth = width - (graphPadding * 2);

var g = svg.append('g')
	.attr('width', graphWidth)
	.attr('height', graphHeight)
	.attr('transform', 'translate(' + graphPadding + ',0)');

var x = d3.scaleLinear()
	.rangeRound([0, graphWidth]);

var bins = d3.histogram()
	.domain(x.domain())
	.thresholds(x.ticks(20))
	(data);

var y = d3.scaleLinear()
	.domain([0, d3.max(bins, function(d) { return d.length })])
	.range([graphHeight, 0]);
	
var bar = g.selectAll('.bar')
	.data(bins)
	.enter().append('g')
		.attr('class', 'bar')
		.attr('transform', function(d) { return 'translate(' + x(d.x0) + ',' + y(d.length) + ')'; });
		
bar.append('rect')
	.attr('x', 1)
	.attr('width', x(bins[0].x1) - x(bins[0].x0) - 10)
	.attr('height', function(d) { return graphHeight - y(d.length); })
	.style('fill', '#FECA3D');
	
	
// bar.append('text')
// 	.attr('dy', '0.75em')
// 	.attr('y', 6)
// 	.attr('x', (x(bins[0].x1) - x(bins[0].x0)) / 2)
// 	.attr('text-anchor', 'middle')
// 	.text(function(d) { return d3.format(',.0f')(d.length); })
// 	.attr('stroke', 'white')
// 	.attr('fill', 'white');
	
svg.append('g')
	.attr('class', 'axis axis--x')
	.attr('transform', 'translate(' + graphPadding + ',' + graphHeight + ')')
	.attr('stroke', 'white')
	.call(d3.axisBottom(x));
	
	
	