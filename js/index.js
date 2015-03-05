/* jshint node: true */
'use strict';
var PIXI = require('pixi');
var Camera = require('Camera');
var Player = require('Player');
var Button = require('ui/Button');
var Inventory = require('inventory/Inventory');
var InventoryUI = require('inventory/InventoryUI');
var DragDropManager = require('ui/DragDropManager');
var Tooltip = require('Tooltip');

PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

// set up global stuff
var stage = new PIXI.Stage(0xDDDDDD, true);
var renderer = PIXI.autoDetectRenderer(800, 600);

// build display list
var iso = new PIXI.DisplayObjectContainer();
var floor = new PIXI.DisplayObjectContainer();
var grid = new PIXI.DisplayObjectContainer();
var gridUI = new PIXI.DisplayObjectContainer(); // highlights etc
var objects = new PIXI.DisplayObjectContainer();
var ui = new PIXI.DisplayObjectContainer();

//var rng = new RNG();
var data = generateMapData(50,50);
var map = new MapData(data);

ui.interactive = true;
iso.interactive = true;
grid.alpha = 0.05;

var camera = new Camera(480, 270, iso);
camera.setZoom(2);

stage.addChild(camera);
stage.addChild(ui);
iso.addChildren([floor, grid, gridUI, objects]);

// add to dom
var wrapper = document.getElementById('canvas-wrapper');
wrapper.appendChild(renderer.view);

// stop context menu
wrapper.addEventListener("contextmenu", function(e) {
    e.preventDefault();
    return false;
});


// init singletons
DragDropManager.init(ui);

// todo move to a ui object
// ui experiments
var floorInventoryUI = new InventoryUI(new Inventory(7,7), 24, 24);
floorInventoryUI.position.set(500, 50);
ui.addChild(floorInventoryUI);

var playerInventoryUI = new InventoryUI(Player.inventory, 24, 24);
playerInventoryUI.position.set(500, 250);
ui.addChild(playerInventoryUI);

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
    ui.addChild(btn);
    btn.position.set(500, 10);

    var btn = new Button('take all', takeAllLoot);
    ui.addChild(btn);
    btn.position.set(540, 10);

    ui.addChild(TileInfo);
    TileInfo.position.set(10,300);

    ui.addChild(Tooltip);
    Tooltip.position.set(200, 300);

    generateIsoGraphics();

    Player.setPosition(
        Math.floor(map.width / 2),
        Math.floor(map.height / 2)
    );

    searchCurrentTile();

    camera.setTarget(Player.position);

    requestAnimFrame(animate);
}


/**
 * main loop
 */
function animate(time) {

    requestAnimFrame(animate);

    objects.children.sort(function (a, b) {

        var zA = a.position.x + a.position.y + (a.zIndex / 10),
            zB = b.position.x + b.position.y + (b.zIndex / 10);

        return zA - zB;
    });

    renderer.render(stage);
}