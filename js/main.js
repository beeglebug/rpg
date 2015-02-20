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
DragDropManager.init(stage);

// ui experiments
var floorInventory = new Inventory(7, 7);
var floorInventoryUI = new InventoryGrid(floorInventory, 24, 24);
floorInventoryUI.position.set(400, 50);
ui.addChild(floorInventoryUI);

var playerInventoryUI = new InventoryGrid(player.inventory, 24, 24);
playerInventoryUI.position.set(400, 250);
ui.addChild(playerInventoryUI);


ui.interactive = true;
ui.mousemove = function(e) {

    Tooltip.onMouseMove(e);

};


/**
 * main loop
 */
function animate(time) {

    requestAnimFrame(animate);

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

    Logger.log('assets loaded');

    var btn = new Button('loot', lootCurrentTile);
    ui.addChild(btn);
    btn.position.set(400, 10);

    generateIsoGraphics();

    player.setPosition(2, 2);
    lootCurrentTile();

    requestAnimFrame(animate);
}

function lootCurrentTile() {

    var tile = player.tile;
    var loot = null;

    switch (tile.type) {
        case 'R':
            loot = new InventoryItem(1, 1, 'newspaper');
            break;
        case 'G':
            loot = new InventoryItem(1, 1, 'flower');
            break;
        case 'H':
            loot = new InventoryItem(1, 1, 'book');
            break;
        case 'T':
            loot = new InventoryItem(1, 1, 'acorn');
            break;
    }

    if (loot) {
        tile.items.push(loot);
        floorInventory.clear();
        floorInventory.fill(tile.items);
    }
}

// todo move to helpers
function array2d(width, height, fill) {

    var x, y, arr = [];

    for (y = 0; y < width; y++) {
        arr[y] = [];
        for (x = 0; x < height; x++) {
            arr[y][x] = fill;
        }
    }

    return arr;
}

