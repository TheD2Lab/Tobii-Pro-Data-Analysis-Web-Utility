
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


function showResults(data) {

	console.log(data);

	var table = d3.select('#resultContainer')
		.append('table')
	
	table.append('thead').append('tr')
		.selectAll('th')
		.data(header).enter()
		.append('th')
		.text(function(d) { return d; });
	
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