/* jshint node: true */
'use strict';

var MapRenderer = function(map) {

    this.highlight = new MapHighlight();

    this.iso = new PIXI.DisplayObjectContainer();

    var floor = new PIXI.DisplayObjectContainer();
    var grid = new PIXI.DisplayObjectContainer();
    var gridUI = new PIXI.DisplayObjectContainer(); // highlights etc
    var objects = new PIXI.DisplayObjectContainer();

    this.iso.addChildren([floor, grid, gridUI, objects]);

    iso.interactive = true;
    grid.alpha = 0.05;


    gridUI.addChild(highlight.sprite);

    player.sprite = PIXI.Sprite.fromFrame('man.png');
    player.sprite.setAnchor(3, 0);
    player.sprite.zIndex = 1;
    objects.addChild(player.sprite);

    var x, y, sprite, tile;

    // build floor layer
    for (y = 0; y < map.data.length; y++) {

        for (x = 0; x < map.data[0].length; x++) {

            tile = map.getTileAt(x, y);

            switch(tile.type) {
                case 'R':
                    tile.sprite = PIXI.Sprite.fromFrame('road.png');
                    break;
                case 'G':
                    tile.sprite = PIXI.Sprite.fromFrame('grass.png');
                    break;
                case 'H':
                    tile.sprite = PIXI.Sprite.fromFrame('grass.png');
                    sprite = PIXI.Sprite.fromFrame('house.png');
                    sprite.setAnchor(17, 15);
                    sprite.position.set(x, y);
                    sprite.zIndex = 0;
                    sprite.position.toScreen();
                    objects.addChild(sprite);
                    tile.objects.push(sprite);
                    //todo move this
                    tile.solid = true;
                    break;
                case 'T':
                    tile.sprite = PIXI.Sprite.fromFrame('grass.png');
                    sprite = PIXI.Sprite.fromFrame('trees.png');
                    sprite.setAnchor(17, 14);
                    sprite.position.set(x, y);
                    sprite.zIndex = 0;
                    sprite.position.toScreen();
                    objects.addChild(sprite);
                    tile.objects.push(sprite);
                    break;
            }

            tile.position.set(x, y);
            tile.sprite.position.set(x, y);
            tile.sprite.setAnchor(17, 0);
            tile.sprite.position.toScreen();
            floor.addChild(tile.sprite);
        }
    }

    var gridTile;

    // make a grid
    for (y = 0; y < map.data.length; y++) {
        for (x = 0; x < map.data[0].length; x++) {
            gridTile = PIXI.Sprite.fromFrame('grid.png');
            gridTile.position.set(x, y);
            gridTile.setAnchor(17, 0);
            gridTile.position.toScreen();
            grid.addChild(gridTile);
        }
    }

};


MapRenderer.prototype.renderLighting = function() {

    var x, y, tile;

    for (y = 0; y < this.map.data.length; y++) {
        for (x = 0; x < this.map.data[0].length; x++) {
            tile = this.map.data[y][x];
            this.setLighting(tile.sprite, tile.visibility);
            tile.objects.forEach(function (sprite) {
                this.setLighting(sprite, tile.visibility);
            }.bind(this));
        }
    }
};

MapRenderer.prototype.setLighting = function(sprite, visibility) {

    switch (visibility) {
        // never seen
        case 0:
            sprite.visible = false;
            break;
        // previously seen
        case 1:
            sprite.tint = 0x555555;
            sprite.visible = true;
            break;
        // currently visible
        case 2:
            sprite.tint = 0xFFFFFF;
            sprite.visible = true;
            break;
    }

};

module.exports = MapRenderer;