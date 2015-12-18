var MovingAverage = require('../moving-average.js');

describe('MovingAverage', function() {
	it('calculates the moving average', function() {
		var movingAverage = new MovingAverage([1, 2, 3]);
		expect(movingAverage.average).toEqual(2);
	});

	it('allows values to be pushed', function() {
		var movingAverage = new MovingAverage([1, 2, 3]);
		movingAverage.push(3);
		movingAverage.push(3);
		expect(movingAverage.average).toBe(4);
	});
});
