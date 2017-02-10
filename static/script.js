'use strict'

const YELLOW = '#FECA3D';
const RED = '#FB441E';

const DESCRIPTIVE_STATS = 'DescriptiveStats';

var decimalFormat = d3.format('.2f');

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
	
// 	appendMeasuresOfProcessing(res);
// 	
// 	appendMeasuresOfCognition(res);
// 	
// 	appendRawMeasures(res);
	
}

const FIXATION = "Fixation";
const SACCADE = "Saccade";
const HULL = "ConvexHull"
const STATS = "DescriptiveStats";
const SUM = "sum";
const AREA = "Area";
const MEAN = "mean";
const COUNT = "Count";
const SACCADE_LENGTH = 'SaccadeLength';
const POINTS = "Points";
const SAMPLES = 'Samples';

function appendMeasuresOfSearch(res) {

	var fixCount = res[FIXATION][COUNT];
	var sacCount = res[SACCADE][COUNT];
	var avgSacLength = res[SACCADE][SACCADE_LENGTH][STATS][MEAN];
	var scanLength = res[SACCADE][SACCADE_LENGTH][STATS][SUM];
	var hullArea = res[FIXATION][HULL][AREA];
	var hullPoints = res[FIXATION][HULL][POINTS];
	var fixationPoints = res[FIXATION][POINTS];
	var saccadeLengths = res[SACCADE][SACCADE_LENGTH][SAMPLES];
	
	var tableData = [
		{ 'Measure' : 'Fixation Count', 'Value' : fixCount, 'Plot' : null },
		{ 'Measure' : 'Saccade Count', 'Value' : sacCount, 'Plot' : null },
		{ 'Measure' : 'Average Saccade Length', 'Value' : avgSacLength, 'Plot' : function() { showSearchGraph('') } },
		{ 'Measure' : 'Scanpath Length', 'Value' : scanLength, 'Plot' : function() { showSearchGraph('hullGraph') } },
		{ 'Measure' : 'Convex Hull Area', 'Value' : hullArea, 'Plot' : function() { showSearchGraph('hullGraph') } }
	];
	
	appendMeasureTable('search', d3.select('#searchBox .measText'), tableData);
	
	appendPlot(d3.select('#hullGraph'), fixationPoints, hullPoints);
	
	appendHistogram(d3.select('#searchGraph'), Object.values(saccadeLengths).map(function(d) { return parseFloat(d); }));
	
	showPlotLegend()
}

function showSearchGraph(g) {
	if (g == 'hullGraph') {
		$('#hullGraphLegend').show();
		$('#hullGraph').show();
		$('#searchGraph').hide();
	}
	else {
		$('#hullGraphLegend').hide();
		$('#hullGraph').hide();
		$('#searchGraph').show();
	}
}

function appendMeasureTable(name, elem, data) {

	var headings = ['Measure', 'Value', 'Plot'];
	
	var table = elem.append('table')
		.attr('class', 'measTable');
	
	table.append('thead')
		.append('tr')
		.selectAll('th')
		.data(headings)
		.enter()
			.append('th')
			.attr('class', 'measHead')
			.html(function(d) { return d; })
		
	var cells = table.append('tbody')
		.selectAll('tr')
		.data(data)
			.enter()
			.append('tr')
			.selectAll('td')
			.data(function(d) {
				var props = [];
				for (var i = 0; i < headings.length; i++) {
					props[i] = d[headings[i]];
				}
				return props;
			})
			.enter()
				.append('td')
				.attr('class', 'measCell')
				.style('width', function(d, i) { 
					return i != headings.length - 1 ? '40%' : '20%'; 
				})
				.html(function(d, i) { 
						switch(i) {
							case 0: 
								return d;
							case 1: 
								return decimalFormat(d);
							case 2: 
								return "";
						}
				});
	
	// Plot cells without graph.
	cells.filter(function(d, i) { 
				return i == headings.length - 1 && d === null; 
			})
			.html('X');
				
	// Plot cells with graph.		
	cells.filter(function(d, i) { 
				return i == headings.length - 1 && d !== null; 
			})
			.append('input')
			.attr('type', 'radio')
			.attr('name', name + 'Plot')
			.on('click', function() {
				(d3.select(this.parentNode).datum())();
			});
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

function getGraphDimensions() {
	var height = d3.select('.measText').node().getBoundingClientRect().height;
	var width = d3.select('.measGraph').node().getBoundingClientRect().width - 20;
	
	return { height: height, width: width}
}

const GRAPH_TITLE_FONT_SIZE = 16;
const GRAPH_LABEL_FONT_SIZE = 12;

function appendHistogram(svg, data) {

	// sizing
		 
	var margin = { top: GRAPH_TITLE_FONT_SIZE + 2, bottom: 50, left: 50, right: 20 };
	var dimensions = getGraphDimensions();
	var height = dimensions.height;
	var width = dimensions.width;
	var graphHeight = height - margin.top - margin.bottom;
	var graphWidth = width - margin.left - margin.right;
	
	// scales and generators
	
	var x = d3.scaleLinear()
		.domain([0, 2000])
		.rangeRound([0, graphWidth]);

	var bin = d3.histogram()
		.domain(x.domain())
		.thresholds(x.ticks(20));
		
	var bins = bin(data);

	var y = d3.scaleLinear()
		.domain([0, d3.max(bins, function(d) { return d.length })])
		.range([graphHeight, 0]);
		
	var xaxis = d3.axisBottom(x)
			.tickPadding(6);
			
	var yaxis = d3.axisLeft(y)
		.tickSizeInner(-graphWidth)
		.tickSizeOuter(3)
		.tickPadding(8);
		
	var barWidth =  x(bins[0].x1) - x(bins[0].x0);
	
	// appends 
	
	svg.attr('width', width).attr('height', height);

	appendTitle(svg, margin, dimensions, "Saccade Length Distribution")
	appendYAxis(svg, yaxis, margin, dimensions, 'Count');
	appendXAxis(svg, xaxis, margin, dimensions, 'Length (px)');
	
	var g = svg.append('g')
		.attr('width', graphWidth)
		.attr('height', graphHeight)
		.attr('transform', translate(margin.left, margin.top));
		
	var bars = g.selectAll('.bar')
		.data(bins)
		.enter()
			.append('g')
			.attr('class', 'bar')
			.attr('transform', function(d) { return translate(x(d.x0) ,y(d.length)); });
		
	bars.append('rect')
		.attr('x', 1)
		.attr('width', barWidth - 4)
		.attr('height', function(d) { return graphHeight - y(d.length); })
		.style('fill', YELLOW);
}


function appendXAxis(svg, axis, margin, dimensions, label) {

	svg.append('g')
		.attr('class', 'axis axis--x')
		.attr('transform', translate(margin.left, dimensions.height - margin.bottom))
		.attr('stroke', 'white')
		.call(axis);
	
	var labelX = margin.left + (0.5 * (dimensions.width - margin.left - margin.right));
	var labelY = dimensions.height - GRAPH_LABEL_FONT_SIZE;
	
	svg.append('text')
		.attr('transform', translate(labelX, labelY))
		.style('text-anchor', 'middle')
		.style('font-size', GRAPH_LABEL_FONT_SIZE + 'px')
		.style('fill', 'white')
		.text(label);
}


function appendYAxis(svg, axis, margin, dimensions, label) {

	svg.append('g')
		.attr('class', 'axis axis--y')
		.attr('transform', translate(margin.left, margin.top))
		.attr('stroke', 'white')
		.call(axis);
		
	var labelX = margin.top + (0.5 * (dimensions.height - margin.top - margin.bottom));
	
	svg.append('text')
		.attr('transform', 'rotate(-90)')
		.attr('y', GRAPH_LABEL_FONT_SIZE)
		.attr('x', -labelX)
		.attr('text-anchor', 'middle')
		.style('font-size', GRAPH_LABEL_FONT_SIZE + 'px')
		.style('fill', 'white')
		.text(label);
}

function appendPlot(svg, points, hull) {

	var dims = getGraphDimensions();
	
	var h = dims.height;
	var w = dims.width;
	
	var xAxisPadding = 30;
	var yAxisPadding = 40;
	
	svg.attr('height', h)
		.attr('width', w);
	
	var title = svg.append('text')
		.attr('width', w)
		.attr('font-size', '16px')
		.attr('fill', 'white')
		.attr('text-anchor', 'middle')
		.text('Scanpath and Convex Hull Plots');

	var titleBox = title.node().getBBox();
	
	var xRange = [yAxisPadding + 15, w - 15];
	var xRangeMag = xRange[1] - xRange[0]
	title.attr('transform', 'translate(' + ((xRangeMag)/2 + yAxisPadding + 15) + ',' + titleBox.height + ')');
	var xdomain = d3.extent(points, function(p) {
		return p.x;
	});
	
	var ydomain = d3.extent(points, function(p) {
		return p.y;
	});
	
	var xline = d3.scaleLinear()
		.domain(xdomain)
		.range(xRange);
		
	var yline = d3.scaleLinear()
		.domain(ydomain)
		.range([h - xAxisPadding - 15,title.node().getBBox().height + 20]);
		
	var line = d3.line()
		.x(function(d) { return xline(d.x); })
		.y(function(d) { return yline(d.y); });
		

	// all
	svg.append('path')
		.attr('d', function(d)  { return line(points); })
		.style('stroke', 'white')
		.style('stroke-width', '1')
		.style('fill', 'none');
		
	svg.selectAll('.fix')
		.data(points)
		.enter()
			.append('circle')
			.attr('class', 'fix')
			.attr('cx', function(d) { return xline(d.x); })
			.attr('cy', function(d) { return yline(d.y); })
			.attr('r', 3)
			.attr('fill', 'white')
			.attr('opacity', 0.3);
	
	// hull		
	svg.append('path')
		.attr('d', function(d)  { return line(hull); })
		.style('stroke', YELLOW)
		.style('stroke-width', '2')
		.style('fill', 'none');
		
	svg.selectAll('.hull')
		.data(hull)
		.enter()
			.append('circle')
			.attr('class', 'hull')
			.attr('cx', function(d) { return xline(d.x); })
			.attr('cy', function(d) { return yline(d.y); })
			.attr('r', 5)
			.attr('opacity', 0.7)
			.attr('fill', RED );
			
	
	var axisX = svg.append('g')
		.attr('class', 'axis axis--x')
		.attr('transform', 'translate(' + 0 + ',' + (h - xAxisPadding) + ')')
		.attr('stroke', 'white')
		.call(d3.axisBottom(xline).tickValues(xdomain));

	var offset = axisX.node().getBBox().height;
	var xOffset = yAxisPadding + axisX.node().getBBox().width/2;
	
	axisX.append('text')
		.attr('transform', 'translate(' + xOffset + ',' + offset + ')')
		.style('text-anchor', 'middle')
		.text('x-pixels');
		
	var axisY = svg.append('g')
		.attr('class', 'axis axis--y')
		.attr('transform', 'translate(' + (yAxisPadding) + ',' + 0 + ')')
		.attr('stroke', 'white')
		.call(d3.axisLeft(yline).tickValues(ydomain));
		
	var hfsPlus = axisY.node().getBBox().height / 2;
	
	axisY.append('text')
		.attr('transform', 'rotate(-90)')
		.attr('y', -yAxisPadding / 2)
		.attr('x', -hfsPlus)
		.attr('text-anchor', 'middle')
		.text('y-pixels');
}

function showPlotLegend() {

	var p = d3.select(".measGraphFooter");
	
	var width = p.node().getBoundingClientRect().width;
	var height = p.node().getBoundingClientRect().height;
	
	console.log(height);
	
	var svg = d3.select('#hullGraphLegend')
		.attr('width', width)
		.attr('height', height);
		
	var stdFix = svg.append('g')
		.attr('transform', 'translate(' + (width * 0.20) + ',' + (height * 0.25) + ')');
		
	var radius = 10
	stdFix.append('circle')
		.attr('fill', 'white')
		.attr('cy', -(radius/2))
		.attr('r', radius);
		
	var stdFixText = stdFix.append('text')
		.attr('text-anchor', 'middle')
		.style('font-size', '12px')
		.attr('fill', 'white')
		.text('Fixation');
	
	stdFixText.attr('dx', stdFixText.node().getBBox().width/2 + (radius * 2));
		
	var hullFix = svg.append('g')
		.attr('transform', 'translate(' + (width * 0.60) + ',' + (height * 0.25) + ')');
		
	var radius = 10
	hullFix.append('circle')
		.attr('fill', RED)
		.attr('cy', -(radius/2))
		.attr('r', radius);
		
	var hullFixText = hullFix.append('text')
		.attr('text-anchor', 'middle')
		.style('font-size', '12px')
		.attr('fill', 'white')
		.text('Convex Hull Fixation');
	
	hullFixText.attr('dx', hullFixText.node().getBBox().width/2 + (radius * 2));



	var scanpathData = [ 
		{ x: width * 0.15, y:  height * 0.75 },
		{ x: width * 0.25, y: height * 0.75 }
	];
	
	var line = d3.line()
		.x(function(d) { return d.x; })
		.y(function(d) { return d.y; });
	
	svg.append('path')
		.attr('d', function(d)  { return line(scanpathData); })
		.style('stroke', 'white')
		.style('stroke-width', '3')
		.style('fill', 'none');
		
	svg.append('text')
		.attr('transform', 'translate(' + (width * 0.28) + ',' + (height * 0.75) + ')')
		.attr('dy', 3)
		.style('font-size', '12px')
		.attr('fill', 'white')
		.text('Scanpath');	
		
		
	var scanpathData2 = [ 
		{ x: width * 0.55, y:  height * 0.75 },
		{ x: width * 0.65, y: height * 0.75 }
	];
	
	svg.append('path')
		.attr('d', function(d)  { return line(scanpathData2); })
		.style('stroke', YELLOW)
		.style('stroke-width', '3')
		.style('fill', 'none');
		
	svg.append('text')
		.attr('transform', 'translate(' + (width * 0.68) + ',' + (height * 0.75) + ')')
		.attr('dy', 3)
		.style('font-size', '12px')
		.attr('fill', 'white')
		.text('Convex Hull Boundary');	
}


function translate(x, y) {
	return 'translate(' + x + ',' + y + ')';
}


function appendTitle(svg, margin, dimensions, text) {

	var centerX = margin.left + (0.5 * (dimensions.width - margin.left - margin.right));
	
	svg.append('text')
		.attr('transform', translate(centerX, GRAPH_TITLE_FONT_SIZE))
		.attr('font-size', GRAPH_TITLE_FONT_SIZE + 'px')
		.attr('fill', 'white')
		.attr('text-anchor', 'middle')
		.text(text);
}

