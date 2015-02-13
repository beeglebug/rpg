var Mob = function (x, y) {

    x = x || 0;
    y = y || 0;

    this.position = new PIXI.Point(x, y);
    this.tile = null;

};

Mob.prototype.moveToTile = function(tile) {

    this.position.set(tile.position.x, tile.position.y);
    this.tile = tile;

    mapRenderer.centerOnTile(tile);

    map.resetVisibility();

    map.calculateVisibility(
        tile.position.x,
        tile.position.y,
        4
    );

    mapRenderer.renderLighting();


};