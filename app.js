var express = require('express')
var multer = require('multer')
var exec = require('child_process').exec;
var app = express()

var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, './uploads')
	},
	filename: function(req, file, cb) {
		cb(null, 'tobii_export.tsv')
	}
})

var upload = multer({ storage: storage }).single('file')

app.use('/', express.static('client'))

app.post('/uploads', function(req, res) {
	upload(req, res, function(err) {
		if (err) {
			return res.end('File upload error.')
		}
		else {
			exec('java -jar ./server/analysis.jar uploads/tobii_export.tsv server/out.json', 
				function(error, stdout, stderr) {
					console.log(stderr);
					res.sendFile("server/out.json", { root: './'});
			})
		}
	})
})


app.listen(3000, function() {
	console.log('App listening on port 3000.')
})