/* jshint node: true */
var PIXI = require('pixi.extra');
var Camera = require('Camera');

// constants
ISO_TILE_WIDTH = 32;
ISO_TILE_HEIGHT = 16;
ISO_TILE_WIDTH_HALF = ISO_TILE_WIDTH / 2;
ISO_TILE_HEIGHT_HALF = ISO_TILE_HEIGHT / 2;

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
//var player = new Player();
//var data = generateMapData(50,50);
//var map = new MapData(data);

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