#!/usr/bin/nodejs

'use strict'

const express = require('express');
const multer = require('multer');
const exec = require('child_process').exec;
const fs = require('fs');

const lys = require('./analysisjs/main.js');

const app = express();

const INPUT_FILE = 'in.tsv';
const OUTPUT_FILE = 'out.json';
const UPLOAD_DIR = './uploads/';
const INPUT_PATH = UPLOAD_DIR + INPUT_FILE;
const JAVA_DIR = './analysis/';
const OUTPUT_PATH = JAVA_DIR + OUTPUT_FILE;
const JAVA_FILE = 'analysis.jar';
const JAVA_PATH = JAVA_DIR + JAVA_FILE;
const JAVA_COMMAND = 'java -jar ' + JAVA_PATH + ' ' + INPUT_PATH + ' ' + OUTPUT_PATH;
 
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
		

app.listen(3000, function() {
	console.log('App listening on port 3000.')
});