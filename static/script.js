
 document.getElementById("compute").addEventListener('click', function() {
 	
 	var xhr = new XMLHttpRequest();
 	var fd = new FormData();
 
 	fd.append("file", document.getElementById("file").files[0]);
 	
 	var stats = "";
 	var stack = [];
 	var elems = document.getElementsByClassName("descStat");
 	for (var i = 0; i < elems.length; i++) {
 		if (elems[i].checked) {
			stack.push(elems[i].getAttribute("data-value"));
		}
	}
	
	for (var i = 0; i < stack.length; i++) {
		stats += stack[i];
		if (i != stack.length - 1) {
			stats += ":";
		}
	}
 	
 	fd.append("stats", stats);
 	
 	xhr.onload = function() {
 		var json = JSON.parse(this.response);
 		console.log(json);
 		
 		var metricsHtml = "";
 		var metrics = json["metrics"];
 		for (key in metrics) {
 			metricsHtml += "<span class='largeCell'>" + key + " = " + metrics[key] + "</span>";
 		}
 		
 		if (document.getElementById("validity").checked) document.getElementById("metricOut").innerHTML = metricsHtml;
 		
 		
 		var statsHtml = "<span class='cell'>Attribute</span>"
 			+ "<span class='cell'>Mean</span>"
 			+ "<span class='cell'>Median</span>"
 			+ "<span class='cell'>Mode</span>"
 			+ "<span class='cell'>Variance</span>"
 			+ "<span class='cell'>Std Dev</span>"
 			+ "<span class='cell'>Min</span>"
 			+ "<span class='cell'>Max</span>"
 			+ "<br/>";
 		var stats = json["stats"];
 		for (key in stats) {
 			var attribute = stats[key];
			statsHtml += "<span class='cell'>" + key + "</span>"
				+ "<span class='cell'>" + parseFloat(attribute["mean"]).toFixed(2) + "</span>"
				+ "<span class='cell'>" + parseFloat(attribute["median"]).toFixed(2) + "</span>"
				+ "<span class='cell'>" + parseFloat(attribute["mode"]).toFixed(2) + "</span>"
				+ "<span class='cell'>" + parseFloat(attribute["variance"]).toFixed(2) + "</span>"
				+ "<span class='cell'>" + parseFloat(attribute["standard deviation"]).toFixed(2) + "</span>"
				+ "<span class='cell'>" + parseFloat(attribute["min"]).toFixed(2) + "</span>"
				+ "<span class='cell'>" + parseFloat(attribute["max"]).toFixed(2) + "</span>";			
 		}
 		
 		document.getElementById("statOut").innerHTML = statsHtml;
 	};
 	
 	xhr.addEventListener('error', function(event) {
 		alert("Error");
 	});
 	
 	xhr.upload.onprogress = function(e) {
 		if (e.lengthComputable) {
 			var percentComplete = (e.loaded / e.total) * 100;
 			document.getElementById("progress").innerHTML = percentComplete;
 		}
 	};
 	
 	xhr.open("POST", "upload.php");
 	
 	xhr.send(fd);
 	
});
 	
function write(stat, val) {
	document.getElementById(stat + "Out").innerHTML = val;
}

function read() {
	return document.getElementById("in").value.split(",");	
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