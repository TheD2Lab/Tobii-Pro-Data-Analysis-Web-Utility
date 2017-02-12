'use strict'

// colors
const YELLOW = '#FECA3D';
const RED = '#FB441E';

// response keys
const FIXATION = "Fixation";
const SACCADE = "Saccade";
const DURATION = "Duration";
const HULL = "ConvexHull"
const SUM = "sum";
const AREA = "Area";
const MEAN = "mean";
const COUNT = "Count";
const SACCADE_LENGTH = 'SaccadeLength';
const POINTS = "Points";
const SAMPLES = 'Samples';
const STATS = 'DescriptiveStats';
const PUPIL = "Pupil";
const PUPIL_LEFT = "PupilLeft";
const PUPIL_RIGHT = "PupilRight";
const ABS_ANGLE = "AbsoluteSaccadicDirection";
const REL_ANGLE = "RelativeSaccadicDirection";
const ANGLE = "Angle"
const META = 'Meta';

// raw tabel entries
const ALL_STATS = [
	'name', 
	'mean', 
	'median', 
	'mode', 
	'standard deviation', 
	'variance', 
	'sum', 
	'min',
	'max',
	'plot'
];

const GRAPH_TITLE_FONT_SIZE = 16;
const GRAPH_LABEL_FONT_SIZE = 12;

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
	var avgSacLength = res[SACCADE][SACCADE_LENGTH][STATS][MEAN];
	var scanLength = res[SACCADE][SACCADE_LENGTH][STATS][SUM];
	var hullArea = res[FIXATION][HULL][AREA];
	var hullPoints = res[FIXATION][HULL][POINTS];
	var fixationPoints = res[FIXATION][POINTS];
	var saccadeLengths = res[SACCADE][SACCADE_LENGTH][SAMPLES];
	
	var tableData = [
		{ 'Measure' : 'Fixation Count', 
			'Value' : fixCount, 
			'Plot' : null 
		},
		{ 'Measure' : 'Saccade Count', 
			'Value' : sacCount, 
			'Plot' : null 
		},
		{ 
			'Measure' : 'Average Saccade Length', 
			'Value' : avgSacLength, 
			'Plot' : function() { showHistogram('avgSacLengthGraph', 'searchGraph', saccadeLengths) } 
		},
		{ 
			'Measure' : 'Scanpath Length', 
			'Value' : scanLength, 
			'Plot' : function() { showCoordinatePlot('hullGraph', 'searchGraph', fixationPoints, hullPoints) } 
		},
		{ 
			'Measure' : 'Convex Hull Area', 
			'Value' : hullArea, 
			'Plot' : function() { showCoordinatePlot('hullGraph', 'searchGraph', fixationPoints, hullPoints) } 
		}
	];
	
	appendMeasureTable('search', d3.select('#searchBox .measText'), tableData);
}


function appendMeasuresOfProcessing(res) {

	var avgFixDur = res[FIXATION][FIXATION + DURATION][STATS][MEAN];
	var fixDurSamples = res[FIXATION][FIXATION + DURATION][SAMPLES];
	var avgSacDur = res[SACCADE][SACCADE + DURATION][STATS][MEAN];
	var sacDurSamples = res[SACCADE][SACCADE + DURATION][SAMPLES];
	var fixToSacDurRatio = avgFixDur / avgSacDur;
	
	var tableData = [
		{ 
			'Measure': 'Average Fixation Duration', 
			'Value': avgFixDur, 
			'Plot': function() { showHistogram('avgFixDurGraph', 'procGraph', fixDurSamples) }
		},
		{
			'Measure': 'Average Saccade Duration',
			'Value': avgSacDur,
			'Plot': function() { showHistogram('avgSacDurGraph', 'procGraph', sacDurSamples) }
		},
		{
			'Measure': 'Fixation to Saccade Duration Ratio',
			'Value': fixToSacDurRatio,
			'Plot': null
		}
	]
	
	appendMeasureTable('processing', d3.select('#procBox .measText'), tableData);
}


function appendMeasuresOfCognition(res) {
	
	var avgPupilL = res[PUPIL][PUPIL_LEFT][STATS][MEAN];
	var pupilLSamples = res[PUPIL][PUPIL_LEFT][SAMPLES];
	
	var avgPupilR = res[PUPIL][PUPIL_RIGHT][STATS][MEAN];
	var pupilRSamples = res[PUPIL][PUPIL_RIGHT][SAMPLES];
	
	var absAngleSum = res[ANGLE][ABS_ANGLE][STATS][SUM];
	var absAngleSamples = res[ANGLE][ABS_ANGLE][SAMPLES];
	
	var relAngleSum = res[ANGLE][REL_ANGLE][STATS][SUM];
	var relAngleSamples = res[ANGLE][REL_ANGLE][SAMPLES];
	
	var tableData = [
		{ 
			'Measure': 'Average Pupil Left', 
			'Value': avgPupilL, 
			'Plot': function() { showHistogram('avgPupilLGraph', 'cogGraph', pupilLSamples) }
		},
		{ 
			'Measure': 'Average Pupil Right', 
			'Value': avgPupilR, 
			'Plot': function() { showHistogram('avgPupilRGraph', 'cogGraph', pupilRSamples) }
		},
		{ 
			'Measure': 'Sum of Absolute Angles', 
			'Value': absAngleSum, 
			'Plot': function() { showHistogram('absAngleSumGraph', 'cogGraph', absAngleSamples) }
		},
		{ 
			'Measure': 'Sum of Relative Angles', 
			'Value': relAngleSum, 
			'Plot': function() { showHistogram('relAngleSumGraph', 'cogGraph', relAngleSamples) }
		}
	];
	
	appendMeasureTable('cognition', d3.select('#cogBox .measText'), tableData);
}


function appendRawMeasures(res) {

	appendMetadata(getMetadata(res));
	
	appendCounts(getCounts(res));
	
	appendStats(getStats(res));
}


function appendMetadata(metadata) {

	var headings = ['Measure', 'Value'];
	
	var table = d3.select('#metadata')
		.append('table')
		.attr('class', 'metadataTable rawTable');
		
	table.append('caption')
		.html('Metadata');
		
	appendTableHead(table, headings); 
	
	var cells = table.append('tbody')
		.selectAll('tr')
		.data(Object.entries(metadata))
			.enter()
			.append('tr')
			.selectAll('td')
			.data(function(d) { return d; })
			.enter()
				.append('td')
				.html(function(d, i) { return formatCell(d); });
}


function appendStats(stats) {

	var headings = ALL_STATS;
	
	var table = d3.select('#stats')
		.append('table')
		.attr('class', 'statTable rawTable');
		
	table.append('caption')
		.html('All Measure Statistics');
		
	appendTableHead(table, headings); 
	
	console.log(stats);
	
	var cells = table.append('tbody')
		.selectAll('tr')
		.data(stats)
			.enter()
			.append('tr')
			.selectAll('td')
			.data(function(d, i) { 
				var stats = d[STATS];
				var data = [];
				data[0] = { 'name': d['name'] };
				for (var i = 1; i < ALL_STATS.length - 1; i++) {
					var s = ALL_STATS[i];
					data.push({ [s] : stats[ALL_STATS[i]] });
				}
				data.push({ 'Plot' : function() { appendLine(d['name'], d['Samples']); } });
				return data;
			})
			.enter()
				.append('td')
				.html(function(d, i) { 
					var key = Object.keys(d)[0];
					if (key == 'Plot') {
						return '';
					}
					else {
						return formatCell(d[key]); 
					}
				});
				
		cells.filter(function(d, i) { 
				return i == ALL_STATS.length - 1;
			})
			.style('text-align', 'center')
			.append('input')
			.attr('type', 'radio')
			.attr('name', 'rawStats')
			.on('click', function() {
				var f = d3.select(this.parentNode).datum()['Plot'];
				f();
			});
}


function appendLine(metric, data) {

	var parent = d3.select('#rawBox');
	
	parent.selectAll('svg').remove();
	
	var svg = parent.append('svg')
		.attr('id', 'rawLine');
		
	// sizing
		 
	var margin = { top: GRAPH_TITLE_FONT_SIZE + 2, bottom: 50, left: 50, right: 20 };
	var dimensions = { width: parent.node().getBoundingClientRect().width, height: 400 };
	var height = dimensions.height;
	var width = dimensions.width;
	var graphHeight = height - margin.top - margin.bottom;
	var graphWidth = width - margin.left - margin.right;
	
	// scales and generators
	var times = Object.keys(data).map(function(t) { return parseInt(t); });
	var timeExtent = d3.extent(times);
	var minTime = timeExtent[0];
	var adjustedTimes = times.map(function(t) { return (t - minTime) / 1000000; });
	
	var x = d3.scaleLinear()
		.domain(d3.extent(adjustedTimes))
		.rangeRound([0, graphWidth]);

	var values = Object.values(data).map(function(t) { return parseFloat(t); })
	var valueExtent = d3.extent(values);
	
	var y = d3.scaleLinear()
		.domain([0, valueExtent[1]])
		.range([graphHeight, 0]);
		
	var xaxis = d3.axisBottom(x)
			.tickPadding(6);
			
	var yaxis = d3.axisLeft(y)
		.tickSizeInner(-graphWidth)
		.tickSizeOuter(3)
		.tickPadding(8);
		
	// appends 
	
	svg.attr('width', width).attr('height', height);

	appendTitle(svg, margin, dimensions, metric + " Values")
	appendYAxis(svg, yaxis, margin, dimensions, 'Value');
	appendXAxis(svg, xaxis, margin, dimensions, 'Time (s)');
	
	var g = svg.append('g')
		.attr('width', graphWidth)
		.attr('height', graphHeight)
		.attr('transform', translate(margin.left, margin.top));
		
	var line = d3.line()
		.x(function(d) { return x((d[0] - minTime)/1000000); })
		.y(function(d) { return y(d[1]); })
		.curve(d3.curveCatmullRom);
		
	var points = Object.entries(data).map(function(d) {
		return [ parseInt(d[0]), parseFloat(d[1]) ];
	}).sort(function(a,b) {
		return a[0] - b[0];
	});
	
	g.append('path')
		.attr('d', function(d)  { return line(points); })
		.style('stroke', YELLOW)
		.style('stroke-width', '2')
		.style('fill', 'none');
}


function formatCell(value) {
	return isNaN(value) ? value :  d3.format(',.2f')(value);
}


function appendCounts(counts) {

	var headings = ['Measure', 'Value'];
	
	var table = d3.select('#counts')
		.append('table')
		.attr('class', 'countTable rawTable');
		
	table.append('caption')
		.html('Select Measure Counts');
		
	appendTableHead(table, headings); 
	
	var cells = table.append('tbody')
		.selectAll('tr')
		.data(Object.entries(counts))
			.enter()
			.append('tr')
			.selectAll('td')
			.data(function(d) { return d; })
			.enter()
				.append('td')
				.html(function(d, i) { return d; });
}


function appendTableHead(table, headings) {

	table.append('thead')
		.append('tr')
		.selectAll('th')
		.data(headings)
		.enter()
			.append('th')
			.attr('class', 'measHead')
			.html(function(d) { return d; })
}


function getMetadata(res) {
	return res[META];
}


function getCounts(res) {
	var counts = {};
	counts[SACCADE] = res[SACCADE][COUNT];
	counts[FIXATION] = res[FIXATION][COUNT];
	return counts;
}


function getStats(res) {

	var stats = [];
	
	for (var k1 in res) {
		var obj = res[k1];
		for (var k2 in obj) {
			var subObj = obj[k2];
			if (subObj.hasOwnProperty(STATS)) {
				subObj['name'] = k2;
				stats.push(subObj);
			}
		}
	}
	
	return stats;
}


function showHistogram(id, group, data) {

	$('.' + group).hide();
	$('#' + id).show();

	data = Object.values(data).map(function(d) { return parseFloat(d); });
	appendHistogram(d3.select('#' + id), data);
}


function showCoordinatePlot(id, group, points1, points2) {

	$('.' + group).hide();
	$('#' + id).show();

	appendCoordinatePlot(d3.select('#' + id), points1, points2);
}


function appendMeasureTable(name, elem, data) {

	var headings = ['Measure', 'Value', 'Plot'];
	
	var table = elem.append('table')
		.attr('class', 'measTable');
	
	appendTableHead(table, headings);
		
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


function getCellAlignment(i) {
	return i == 0 ? 'center' : 'right';
}


function getCellBorderLeft(i) {
	return i == 0 ? 'none' : '1px solid white';
}


function getGraphDimensions() {
	var height = d3.select('.measText').node().getBoundingClientRect().height;
	var width = d3.select('.measGraph').node().getBoundingClientRect().width - 20;
	
	return { height: height, width: width}
}


function appendHistogram(svg, data) {

	// sizing
		 
	var margin = { top: GRAPH_TITLE_FONT_SIZE + 2, bottom: 50, left: 50, right: 20 };
	var dimensions = getGraphDimensions();
	var height = dimensions.height;
	var width = dimensions.width;
	var graphHeight = height - margin.top - margin.bottom;
	var graphWidth = width - margin.left - margin.right;
	
	// scales and generators
	
	var extent = d3.extent(data);
	
	var x = d3.scaleLinear()
		.domain(extent)
		.rangeRound([0, graphWidth]);

	var bin = d3.histogram()
		.domain(x.domain())
		.thresholds(thresholdGenerator(data));
		
	var bins = bin(data);

	var y = d3.scaleLinear()
		.domain([0, d3.max(bins, function(d) { return d.length })])
		.range([graphHeight, 0]);
		
	var tickFormatter = extent[1] > 9 ? d3.format(',.0f') : d3.format('.1f');
	var xaxis = d3.axisBottom(x)
			.tickValues(thresholdGenerator(data))
			.tickFormat(tickFormatter)
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


function appendCoordinatePlot(svg, points, hull) {

	// sizing
	
	var margin = { top: GRAPH_TITLE_FONT_SIZE + 10, bottom: 30, left: 40, right: 20 };
	var dimensions = getGraphDimensions();
	var height = dimensions.height;
	var width = dimensions.width;
	var graphHeight = height - margin.top - margin.bottom;
	var graphWidth = width - margin.left - margin.right;
	
	// scales and generators

	var xdomain = d3.extent(points, function(p) {
		return p.x;
	});
	
	var ydomain = d3.extent(points, function(p) {
		return p.y;
	});
	
	var xline = d3.scaleLinear()
		.domain(xdomain)
		.range([0, graphWidth]);
		
	var yline = d3.scaleLinear()
		.domain(ydomain)
		.range([graphHeight, 0]);
		
	var line = d3.line()
		.x(function(d) { return xline(d.x); })
		.y(function(d) { return yline(d.y); });
		
	var xaxis = d3.axisBottom(xline).tickValues(xdomain)
	var yaxis = d3.axisLeft(yline).tickValues(ydomain);
	
	// appends
	
	appendTitle(svg, margin, dimensions, 'Scanpath and Convex Hull Plot')	
	appendXAxis(svg, xaxis, margin, dimensions, 'X (px)');
	appendYAxis(svg, yaxis, margin, dimensions, 'Y (px)');

	svg
		.attr('height', height)
		.attr('width', width);
		
	var g = svg.append('g')
		.attr('width', graphWidth)
		.attr('height', graphHeight)
		.attr('transform', translate(margin.left, margin.top));

	g.append('path')
		.attr('d', function(d)  { return line(points); })
		.style('stroke', 'white')
		.style('stroke-width', '1')
		.style('fill', 'none');
		
	g.selectAll('.fix')
		.data(points)
		.enter()
			.append('circle')
			.attr('class', 'fix')
			.attr('cx', function(d) { return xline(d.x); })
			.attr('cy', function(d) { return yline(d.y); })
			.attr('r', 3)
			.attr('fill', 'white')
			.attr('opacity', 0.3);
	
	g.append('path')
		.attr('d', function(d)  { return line(hull); })
		.style('stroke', YELLOW)
		.style('stroke-width', '2')
		.style('fill', 'none');
		
	g.selectAll('.hull')
		.data(hull)
		.enter()
			.append('circle')
			.attr('class', 'hull')
			.attr('cx', function(d) { return xline(d.x); })
			.attr('cy', function(d) { return yline(d.y); })
			.attr('r', 5)
			.attr('opacity', 0.7)
			.attr('fill', RED );
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


function appendTitle(svg, margin, dimensions, text) {

	var centerX = margin.left + (0.5 * (dimensions.width - margin.left - margin.right));
	
	svg.append('text')
		.attr('transform', translate(centerX, GRAPH_TITLE_FONT_SIZE))
		.attr('font-size', GRAPH_TITLE_FONT_SIZE + 'px')
		.attr('fill', 'white')
		.attr('text-anchor', 'middle')
		.text(text);
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


function translate(x, y) {
	return 'translate(' + x + ',' + y + ')';
}


function thresholdGenerator(data) {

	var numBins = 10.0

	var extent = d3.extent(data);
	var min = parseFloat(extent[0]);
	var max = parseFloat(extent[1]);
	
	var bins = [];
	var binSize = (max - min) / numBins;
	for (var i = min; i <= (max + binSize); i += binSize) {
		bins.push(i);
	}

	return bins;
}