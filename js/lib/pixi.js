/* jshint node: true */
'use strict';

var PIXI = require('./pixi.dev.js');

/**
 * assorted extensions to pixi objects, grouped together with original pixi
 */


PIXI.Point.prototype.add = function(point) {

    this.x += point.x;
    this.y += point.y;

    return this;
};


PIXI.Point.prototype.equals = function(point) {

    return this.x == point.x && this.y == point.y;

};

PIXI.Point.prototype.distanceTo = function(point) {

    var dx = Math.abs(this.x - point.x),
        dy = Math.abs(this.y - point.y);

    return Math.sqrt((dx * dx) + (dy * dy));
};


PIXI.Point.ISO_TILE_WIDTH = 32;
PIXI.Point.ISO_TILE_HEIGHT = 16;

PIXI.Point.toScreen = function() {

    this.x = (this.x - this.y) * (PIXI.Point.ISO_TILE_WIDTH / 2);
    this.y = (this.x + this.y) * (PIXI.Point.ISO_TILE_HEIGHT / 2);
};

PIXI.Point.toIso = function() {

    this.x = Math.floor((this.x / (PIXI.Point.ISO_TILE_WIDTH / 2) + this.y / (PIXI.Point.ISO_TILE_HEIGHT / 2)) / 2);
    this.y = Math.floor((this.y / (PIXI.Point.ISO_TILE_HEIGHT / 2) - (this.x / (PIXI.Point.ISO_TILE_WIDTH / 2))) / 2);
};



PIXI.DisplayObjectContainer.prototype.addChildren = function(children)
{
    for(var i = 0; i < children.length; i++) {
        this.addChild(children[i]);
    }
};


PIXI.Sprite.prototype.setAnchor = function(x, y) {

    this.anchor.set(
        x / this.width,
        y / this.height
    );

    return this;
};

module.exports = PIXI;