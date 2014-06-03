/**
 * @module     math
 * @desc       Various commonly used math functions
 * @author     cemckinley <cemckinley@gmail.com>
 * @copyright  Copyright (c) 2013 Cara McKinley
 */


var math = {

	/**
	 * generate randomized number, where number is a number between min and max, and plusOrMinus is a
	 * boolean indicating if that number can be positive or negative
	 * @param  {Number} min         Minimum value
	 * @param  {Number} max         Maximum value
	 * @param  {Boolean} plusOrMinus Set to true if value can be positive or negative
	 * @return {Number}             Resulting random value
	 */
	getRandomNumInRange: function(min, max, plusOrMinus){
		var variation = Math.random() * (max - min),
			randomNumber = max - variation,
			posNeg = 1;

		if(plusOrMinus){
			posNeg = Math.random();
			posNeg = posNeg <= 0.5 ? 1 : -1;
		}

		return randomNumber * posNeg;
	},

	/**
	 * Get a random angle in degrees between a min and max value, with option to be positive or negative
	 * @param  {Number} min         Minimum value
	 * @param  {Number} max         Maximum value
	 * @param  {Boolean} plusOrMinus Set to true if value can be positive or negative
	 * @return {Number}             Resulting random angle in degrees
	 */
	getRandomAngle: function(min, max, plusOrMinus){ // canvas rotates using radians, so output result of randomNumberInRange in radians
		return Math.PI / (180 / this.getRandomNumInRange(min, max, plusOrMinus));
	}

};


module.exports = math;