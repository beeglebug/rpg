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

    floorInventory.fill(tile.items);
};

Player.prototype.exitTile = function(tile) {

    floorInventory.clear();

};