/* jshint node: true */
'use strict';

var Mob = require('Mob');

/**
 * the player
 * @param x
 * @param y
 * @constructor
 * @extends Mob
 */
var Player = function(x, y) {

    Mob.call(this, x, y);

    this.hydration = 100;
    this.nutrition = 100;
};

Player.prototype = Object.create(Mob.prototype);


Player.prototype.eat = function(edible) {

};


Player.prototype.setPosition = function(x, y) {

    // call parent
    Mob.prototype.setPosition.apply(this, arguments);

    //map.resetVisibility();
    //map.calculateVisibility(x, y, 2);

    //renderLighting();
};

Player.prototype.enterTile = function(tile) {

    // todo emit events and subscribe to this from somewhere else
    //floorInventoryUI.setInventory(tile.inventory);

    //tileInfo.setTile(tile);

    //camera.setTarget(tile.position);
};

Player.prototype.exitTile = function(tile) {

};

module.exports = Player;