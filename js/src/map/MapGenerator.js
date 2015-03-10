/* jshint node: true */
'use strict';

var RNG = require('util/RNG');
var MapData = require('map/MapData');

var MapGenerator = function(seed) {

    this.rng = new RNG(seed);
};

MapGenerator.prototype.generate = function(width, height) {

    var i, road,
        data = [];

    for (i = 0; i < height; i++) {
        data.push(this.blankRow(width, 'G'));
    }

    var roadDensity = Math.round(height / 10); // 1 in 10
    var treeDensity = Math.round((width * height) / 10); // 1 in 10
    var houseDensity = Math.round((width * height) / 20); // 1 in 20

    // roads
    for (i = 0; i < roadDensity; i++) {
        road = this.rng.randomIntBetween(0, height - 1);
        data[road] = this.blankRow(width, 'R');
    }

    // houses
    for (i = 0; i < houseDensity; i++) {
        this.setRandomGrassTile('H', data)
    }

    // trees
    for (i = 0; i < treeDensity; i++) {
        this.setRandomGrassTile('T', data)
    }

    return new MapData(data);
};

MapGenerator.prototype.setRandomGrassTile = function(value, data) {

    var y = this.rng.randomIntBetween(0, data.length - 1);
    var x = this.rng.randomIntBetween(0, data[y].length - 1);

    if(data[y][x] !== 'G') {
        return this.setRandomGrassTile(data, value);
    }

    return data[y][x] = value;
};

MapGenerator.prototype.blankRow = function(len, val) {
    var arr = [];
    for(var i = 0; i < len; i++) {
        arr.push(val);
    }
    return arr;
};

module.exports = MapGenerator;