var Responder = (function() {
 
 var responder = []
 
 var meta = {};
 var measures = {};
 
 responder.parse = function(response) {
 	console.log(response);
 	meta = response['data']['metadata'];
 	measures = response['data']['measures'];
 }
 
 responder.getMeta = function() {
 	return meta;
 }
 responder.getMeasure = function(m) {
 	return measures[m];
 }
 
 responder.getMeasures = function() {
 	return measures;
 }
 
 responder.getStats = function(m) {
 	return measures[m]['stats'];
 }
 
 responder.getStat = function(s, m) {
 		return measures[m]['stats'][s];
 }
 
 responder.getSamples = function(m) {
 	return measures[m]['samples'];
 }
 
 responder.getUnits = function(m) {
 	return measures[m]['units'];
 }
 	
 responder.getProp = function(p, m) {
 	return measures[m][p];
 }
 
 return responder;
 		
}());