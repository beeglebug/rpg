/* jshint node: true */
'use strict';

var PIXI = require('pixi');
var Inventory = require('inventory/Inventory');

/**
 * a mobile entity
 * @param x
 * @param y
 * @constructor
 */
var Mob = function(x, y) {

    this.position = new PIXI.Point(x, y);
    this.tile = null;

    this.sprite = null;

    this.inventory = new Inventory(5,5);
};

// todo remove tile references
Mob.prototype.setPosition = function(x, y) {

    // already here
    if(this.position.x === x && this.position.y === y) { return; }

    this.position.set(x, y);

    if(this.sprite) {
        this.sprite.position.set(x,y);
        this.sprite.position.toScreen();
    }

    if(this.tile) {
        this.exitTile(this.tile);
    }

    //this.tile = map.getTileAt(x, y);

    this.enterTile(this.tile);
};


Mob.prototype.enterTile = function(tile) {};

Mob.prototype.exitTile = function(tile) {};

module.exports = Mob;