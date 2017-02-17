'use strict'

/*
 * Environment Config
 */
const PORT = 3000;

const INPUT_FILE = 'in.tsv';
const OUTPUT_FILE = 'out.json';
const UPLOAD_DIR = './uploads/';
const INPUT_PATH = UPLOAD_DIR + INPUT_FILE;
const ANALYSIS_PATH = './analysis/main.js';

// external deps
const express = require('express');
const multer = require('multer');
const fs = require('fs');

// internal deps
const lys = require(ANALYSIS_PATH);


/*
 * Middleware Initialization
 */
 
const app = express();
 
const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, UPLOAD_DIR)
	},
	filename: function(req, file, cb) {
		cb(null, INPUT_FILE)
	}
});

const upload = multer({ storage: storage }).single('file')


/*
 * Middleware Definitions
 */
 
app.use('/', express.static('static'))

app.post('/uploads', function(req, res) {
	upload(req, res, function(err) {
		if (err) {
			res.status(err.status).send('Upload Failed');
		}
		else {
			var csv = fs.readFileSync(INPUT_PATH);
			res.send(lys(csv));
			fs.unlink(INPUT_PATH);
		}
	})
})
		
/*
 * Run
 */
 
app.listen(PORT, function() {
	console.log('App listening on port 3000.')
});