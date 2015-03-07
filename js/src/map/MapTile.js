/* jshint node: true */
'use strict';

var Inventory = require('inventory/Inventory');
var PIXI = require('pixi');

var MapTile = function (type, x, y) {

    this.type = type;
    this.position = new PIXI.Point(x, y);

    // other sprites from the objects layer
    this.objects = [];

    this.name = null;
    this.sprite = null;

    this.visibility = MapTile.VISIBILITY_NONE;
    this.solid = false;

    // stuff on the floor
    this.inventory = new Inventory(7,7);
};

MapTile.VISIBILITY_NONE = 0;
MapTile.VISIBILITY_PREVIOUS = 1;
MapTile.VISIBILITY_VISIBLE = 2;

module.exports = MapTile;