/**
 * modified version of node-mersenne
 * https://github.com/jwatte/node-mersenne
 * @constructor
 */
RNG = function(seed) {

	this.N = 624;
	this.M = 397;
	this.A = 0x9908b0df;
	this.upper = 0x80000000;
	this.lower = 0x7fffffff;
	this.mt = [];

	if(!seed) { seed = new Date().getTime(); }

	this.seed(seed);

};

/**
 * set a seed for the RNG
 * @param  {String} seed a seed for the RNG
 */
RNG.prototype.seed = function(seed) {

	if(typeof seed == 'string') {
		seed = this.hashcode(seed);
	}

	this.mt[0] = seed >>> 0;

	for (this.mti = 1; this.mti < this.N; this.mti++) {

		var s = this.mt[this.mti-1] ^ (this.mt[this.mti-1] >>> 30);
		this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253) + this.mti;
		this.mt[this.mti] >>>= 0;

	}
};

/**
 * generate a random number
 * @return {Number} a random number
 */
RNG.prototype.random = function() {

	var y;
	var mag01 = new Array(0x0, this.A);

	if (this.mti >= this.N)
	{
		var kk;
		for (kk=0;kk<this.N-this.M;kk++)
		{
			y = (this.mt[kk]&this.upper)|(this.mt[kk+1]&this.lower);
			this.mt[kk] = this.mt[kk+this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
		}

		for (;kk<this.N-1;kk++)
		{
			y = (this.mt[kk]&this.upper)|(this.mt[kk+1]&this.lower);
			this.mt[kk] = this.mt[kk+(this.M-this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
		}

		y = (this.mt[this.N-1]&this.upper)|(this.mt[0]&this.lower);
		this.mt[this.N-1] = this.mt[this.M-1] ^ (y >>> 1) ^ mag01[y & 0x1];

		this.mti = 0;
	}

	y = this.mt[this.mti++];

	y ^= (y >>> 11);
	y ^= (y << 7) & 0x9d2c5680;
	y ^= (y << 15) & 0xefc60000;
	y ^= (y >>> 18);

	return (y >>> 0) * (1.0/4294967296.0);
};

/**
 * generate a random integer
 * @return {Number} a random integer
 */
RNG.prototype.randomInt = function() {
	return Math.floor(this.random());
}

/**
 * generate a random integer between min and max
 * @param  {Number} min the minimum value
 * @param  {Number} max the maximum value
 * @return {Number} a random integer
 */
RNG.prototype.randomIntBetween = function(min, max) {

	return Math.floor(this.randomBetween(min, max + 1));
};

/**
 * generate a random number between min and max
 * @param  {Number} min the minimum value
 * @param  {Number} max the maximum value
 * @return {Number} a random number
 */
RNG.prototype.randomBetween = function(min, max) {

	return this.random() * (max - min) + min;
};

RNG.prototype.randomElement = function(arr) {
	return arr[this.randomIntBetween(0, arr.length-1)];
};

RNG.prototype.chance = function(odds) {
    return this.randomIntBetween(0, odds) === 0;
};

RNG.prototype.hashcode = function(str) {

	for(var hash = 0, i = 0, len = str.length; i < len; i++) {
		hash = (31 * hash + str.charCodeAt(i)) << 0;
	}

	return hash;
};