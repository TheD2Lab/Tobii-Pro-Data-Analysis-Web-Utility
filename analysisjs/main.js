'use strict'

var Table = require('./table.js');

var t = new Table('./data.tsv');

// t.print();

console.log(t.getRow(0));

// console.log(t.getCol(4));