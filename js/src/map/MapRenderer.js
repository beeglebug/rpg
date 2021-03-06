/* jshint node: true */
'use strict';

var MapHighlight = require('map/MapHighlight');
var PIXI = require('pixi');

//todo inherit displayobject
var MapRenderer = function(map) {

    PIXI.DisplayObjectContainer.call(this);

    this.map = map;

    this.highlight = new MapHighlight();

    this.floor = new PIXI.DisplayObjectContainer();
    this.grid = new PIXI.DisplayObjectContainer();
    this.gridUI = new PIXI.DisplayObjectContainer(); // highlights etc
    this.objects = new PIXI.DisplayObjectContainer();

    this.addChildren([
        this.floor, this.grid, this.gridUI, this.objects
    ]);

    this.interactive = true;
    this.grid.alpha = 0.05;

    this.gridUI.addChild(this.highlight.sprite);

    var x, y, sprite, tile;

    // build floor layer
    for (y = 0; y < this.map.data.length; y++) {
        for (x = 0; x < this.map.data[y].length; x++) {

            tile = this.map.getTileAt(x, y);

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
                    this.objects.addChild(sprite);
                    tile.objects.push(sprite);
                    break;
                case 'T':
                    tile.sprite = PIXI.Sprite.fromFrame('grass.png');
                    sprite = PIXI.Sprite.fromFrame('trees.png');
                    sprite.setAnchor(17, 14);
                    sprite.position.set(x, y);
                    sprite.zIndex = 0;
                    sprite.position.toScreen();
                    this.objects.addChild(sprite);
                    tile.objects.push(sprite);
                    break;
            }

            tile.position.set(x, y);
            tile.sprite.position.set(x, y);
            tile.sprite.setAnchor(17, 0);
            tile.sprite.position.toScreen();
            this.floor.addChild(tile.sprite);
        }
    }

    var gridTile;

    // make a grid
    for (y = 0; y < this.map.data.length; y++) {
        for (x = 0; x < this.map.data[0].length; x++) {
            gridTile = PIXI.Sprite.fromFrame('grid.png');
            gridTile.position.set(x, y);
            gridTile.setAnchor(17, 0);
            gridTile.position.toScreen();
            this.grid.addChild(gridTile);
        }
    }

};

MapRenderer.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);

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

MapRenderer.prototype.sort = function() {

    this.objects.children.sort(function (a, b) {

        var zA = a.position.x + a.position.y + (a.zIndex / 10),
            zB = b.position.x + b.position.y + (b.zIndex / 10);

        return zA - zB;
    });

};

module.exports = MapRenderer;