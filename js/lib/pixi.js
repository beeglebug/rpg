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

PIXI.Point.prototype.toScreen = function() {

    this.set(
        (this.x - this.y) * (PIXI.Point.ISO_TILE_WIDTH / 2),
        (this.x + this.y) * (PIXI.Point.ISO_TILE_HEIGHT / 2)
    );
};

PIXI.Point.prototype.toIso = function() {

    this.set(
        Math.floor((this.x / (PIXI.Point.ISO_TILE_WIDTH / 2) + this.y / (PIXI.Point.ISO_TILE_HEIGHT / 2)) / 2),
        Math.floor((this.y / (PIXI.Point.ISO_TILE_HEIGHT / 2) - (this.x / (PIXI.Point.ISO_TILE_WIDTH / 2))) / 2)
    );
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