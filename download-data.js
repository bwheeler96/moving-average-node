var fs = require('fs'),
    http = require('http');

var symbol = process.argv[2];
console.log(symbol);
var buffer = "";

var request = http.request({
	hostname: 'real-chart.finance.yahoo.com',
	port: 80,
	path: '/table.csv?s=' + symbol + '&d=11&e=17&f=2015&g=d&a=7&b=9&c=1996&ignore=.csv',
	method: 'GET'
}, function(res) {
	res.on('data', addData);
	res.on('end', function() {
		fs.writeFile(symbol + '.csv', buffer);
	});
});

request.end()

function addData(data) {
	buffer += data;
}
