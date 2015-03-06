/* jshint node: true */
'use strict';

var game = require('Game');
var DragDropManager = require('ui/DragDropManager');

var Player = require('Player');
var Button = require('ui/Button');
var Inventory = require('inventory/Inventory');
var InventoryUI = require('inventory/InventoryUI');
var Tooltip = require('ui/Tooltip');

PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

game.init(document.getElementById('canvas-wrapper'));
DragDropManager.init(game.ui);

// todo move to a ui object
// ui experiments
var floorInventoryUI = new InventoryUI(new Inventory(7,7), 24, 24);
floorInventoryUI.position.set(500, 50);
game.ui.addChild(floorInventoryUI);

var playerInventoryUI = new InventoryUI(Player.inventory, 24, 24);
playerInventoryUI.position.set(500, 250);
game.ui.addChild(playerInventoryUI);

var hoverTile = null;

var loader = new PIXI.AssetLoader([
    'font/munro-11-white.fnt',
    'font/munro-11-black.fnt',
    'img/tiles.json',
    'img/ui.json',
    'data/tile-types.json'
]);

loader.addEventListener('onComplete', assetsLoaded);
loader.load();

function assetsLoaded(e) {

    var btn = new Button('search', searchCurrentTile);
    game.ui.addChild(btn);
    btn.position.set(500, 10);

    var btn = new Button('take all', takeAllLoot);
    game.ui.addChild(btn);
    btn.position.set(540, 10);

    game.ui.addChild(TileInfo);
    TileInfo.position.set(10,300);

    game.ui.addChild(Tooltip);
    Tooltip.position.set(200, 300);

    generateIsoGraphics();

    Player.setPosition(
        Math.floor(game.map.width / 2),
        Math.floor(game.map.height / 2)
    );

    searchCurrentTile();

    game.camera.setTarget(Player.position);

    requestAnimFrame(game.loop);
}
