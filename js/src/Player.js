/* jshint node: true */
'use strict';

var Mob = require('Mob');
var InventoryItem = require('inventory/InventoryItem');

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

Player.prototype.searchCurrentTile = function() {

    var loot = null;

    switch (this.tile.type) {
        case 'R':
            loot = new InventoryItem(2, 2, 'newspaper');
            break;
        case 'G':
            loot = new InventoryItem(1, 2, 'flower');
            break;
        case 'H':
            loot = new InventoryItem(2, 1, 'book');
            break;
        case 'T':
            loot = new InventoryItem(1, 1, 'acorn');
            break;
    }

    if (loot) {
        this.tile.inventory.addItem(loot);
    }
};

Player.prototype.takeAllLootFromCurrentTile = function() {

    this.tile.inventory.moveAllTo(this.inventory);

};






module.exports = Player;