// constants
PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;
ISO_TILE_WIDTH = 32;
ISO_TILE_HEIGHT = 16;
ISO_TILE_WIDTH_HALF = ISO_TILE_WIDTH / 2;
ISO_TILE_HEIGHT_HALF = ISO_TILE_HEIGHT / 2;

// set up global stuff
var stage = new PIXI.Stage(0xDDDDDD, true);
var renderer = PIXI.autoDetectRenderer(800, 600);
var rng = new RNG();
var player = new Player();
var data = generateMapData();
var map = new MapData(data);

// build display list
var iso = new PIXI.DisplayObjectContainer();
var floor = new PIXI.DisplayObjectContainer();
var grid = new PIXI.DisplayObjectContainer();
var gridUI = new PIXI.DisplayObjectContainer(); // highlights etc
var objects = new PIXI.DisplayObjectContainer();
var ui = new PIXI.DisplayObjectContainer();

iso.addChildren([floor, grid, gridUI, objects]);
iso.position.set(200, 100);
iso.interactive = true;
iso.scale.set(2);

grid.alpha = 0.05;

stage.addChild(iso);
stage.addChild(ui);

// add to dom
document.getElementById('canvas-wrapper').appendChild(renderer.view);

// init singletons
DragDropManager.init();

// ui experiments
var floorInventory = new Inventory(7,7);
var floorInventoryUI = new InventoryUI(floorInventory, 24, 24);
floorInventoryUI.graphics.position.set(400,50);
ui.addChild(floorInventoryUI.graphics);


/**
 * main loop
 */
function animate(time) {

    requestAnimFrame( animate );

    TWEEN.update(time);

    sortIso(objects);

    renderer.render(stage);
}

var loader = new PIXI.AssetLoader([
    'font/munro.fnt',
    'img/tiles.json',
    'img/ui.json'
]);

loader.addEventListener('onComplete', assetsLoaded);
loader.load();

function assetsLoaded() {

    generateIsoGraphics();

    player.setPosition(2, 2);

    requestAnimFrame( animate );
}