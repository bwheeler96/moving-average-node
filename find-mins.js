#!/usr/bin/env node

var fs = require('fs'),
    _ = require('underscore'),
    MovingAverage = require('./moving-average'),
    CSV = require('csv-parse')
    yargs = require('yargs').argv;

var SLICE = yargs.slice || 7;
var symbol = yargs.symbol || yargs.s;
var lastBuy = null;

fs.readFile('./' + symbol + '.csv', 'utf8', parseCSV);

function parseCSV(err, data) {
	CSV(data, { delimiter: ",", rowDelimiter: "\n" }, findExtrema);
}

function findExtrema(err, data) {
	var headers = data.shift();
	console.log("Headers: ", headers);
	var quotes = _.map(data, function(quote) {
		return new Quote(headers, quote);
	}).reverse();
	var avgData = [];
	for (var i = 0; i < SLICE; i++) {
		avgData.push(quotes.shift().close);
	}
	console.log(avgData);
	var movingAverage = new MovingAverage(avgData);
	var initialQuote = quotes.shift();
	var aboveMA = initialQuote.close > movingAverage.average;
	var extrema = initialQuote;
	_.each(quotes, function(quote) {
		movingAverage.push(quote.close);
		//console.log(movingAverage.data);
		//console.log("Moving average: ", quote.date, movingAverage.average, quote.open);
		var isAboveMA = quote.close > movingAverage.average;
		if ( isAboveMA != aboveMA ) {
		//	console.log("Crossed boundary:", quote);
			if (isAboveMA && lastBuy == null) {
				//console.log("Low on :", quote.date, "@", extrema.open);
				console.log("Buying on:", quote.date);
				lastBuy = quote;
			} else if (lastBuy) {
				//console.log("High on:", quote.date, "@", extrema.open);
				console.log("Selling on ", quote.date, " - ", lastBuy.close, "at", quote.close);
				console.log("Profit: ", 100 * (1 - lastBuy.close / quote.close), "%");
				lastBuy = null
			}
			aboveMA = isAboveMA;
			extrema = quote;
		} else if (isAboveMA) {
			if (quote.open > extrema.open) extrema = quote;
		} else {
			if (quote.open < extrema.open) extrema = quote;
		}

	});
}

var Quote = function(headers, data) {
	var self = this;
	_.each(headers, function(val, index) {
		self[val.toLowerCase()] = data[index];
	});
	return self;
}
