var MovingAverage = module.exports = function(data, pruneFunction) {
	this.average = 0;
	this.data = data;
	this.pruneFunction = pruneFunction;
	this.calculate();
};

MovingAverage.prototype.calculate = function() {
	for (var index in this.data) {
		var value = this.data[index];
		this.average += value / this.data.length;
	}
};

MovingAverage.prototype.push = function(datum) {
	var length = this.data.length;
	this.average -= this.data.shift() / length;
	this.average += datum / length;
	this.data.push(datum);
};
