/**
 * the player
 * @param x
 * @param y
 * @constructor
 * @extends Mob
 */
var Player = function(x, y) {

    Mob.call(this, x, y);
};

Player.prototype = Object.create(Mob.prototype);

Player.prototype.setPosition = function(x, y) {

    // call parent
    Mob.prototype.setPosition.apply(this, arguments);

    map.resetVisibility();
    map.calculateVisibility(x, y, 2);

    renderLighting();
};

Player.prototype.enterTile = function(tile) {

    // todo emit events and subscribe to this from somewhere else
    floorInventoryUI.setInventory(tile.inventory);

    camera.setTarget(tile.position);

    // todo reset mouse hover
    iso.mousemove(stage.interactionManager.mouse);

};

Player.prototype.exitTile = function(tile) {

};
