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

ui.interactive = true;

iso.addChildren([floor, grid, gridUI, objects]);
iso.interactive = true;
//iso.scale.set(2);

grid.alpha = 0.05;

var camera = new Camera(200, 200, iso);
stage.addChild(camera);
stage.addChild(ui);

// add to dom
document.getElementById('canvas-wrapper').appendChild(renderer.view);

// init singletons
DragDropManager.init(ui);

// ui experiments
var floorInventoryUI = new InventoryUI(new Inventory(7,7), 24, 24);
floorInventoryUI.position.set(400, 50);
ui.addChild(floorInventoryUI);

var playerInventoryUI = new InventoryUI(player.inventory, 24, 24);
playerInventoryUI.position.set(400, 250);
ui.addChild(playerInventoryUI);


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

    var btn = new Button('loot', lootCurrentTile);
    ui.addChild(btn);
    btn.position.set(400, 10);

    var btn = new Button('take all', takeAllLoot);
    ui.addChild(btn);
    btn.position.set(440, 10);

    generateIsoGraphics();

    player.setPosition(2, 2);
    lootCurrentTile();

    camera.setTarget(player.position);

    requestAnimFrame(animate);
}

function lootCurrentTile() {

    var tile = player.tile;
    var loot = null;

    switch (tile.type) {
        case 'R':
            loot = new InventoryItem(2, 2, 'newspaper');
            break;
        case 'G':
            loot = new InventoryItem(1, 2, 'flower');
            break;
        case 'H':
            loot = new InventoryItem(2, 1, 'book');
            break;
        case 'T':
            loot = new InventoryItem(1, 1, 'acorn');
            break;
    }

    if (loot) {
        tile.inventory.addItem(loot);
    }
}

function takeAllLoot() {

    var i, item, added;

    for(i = player.tile.inventory.items.length - 1; i >= 0; i--) {

        item = player.tile.inventory.items[i];

        // we need to remove it first
        player.tile.inventory.removeItem(item);

        added = player.inventory.addItem(item);

        if(!added) {
            // re-add to original inventory
            player.tile.inventory.addItemAtPosition(item, item.position);
        }

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


function randomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '0x';
    for (var i = 0; i < 6; i++ ) {
        color += letters[rng.randomIntBetween(0,15)];
    }
    return color;
}

var hoverTile = null;

iso.mousemove = function (e) {

    var pos = e.getLocalPosition(this);

    screenToMap(pos);

    hoverTile = map.getTileAt(pos.x, pos.y);

    if (hoverTile) {
        highlight.move(pos);
        highlight.show();
    } else {
        highlight.hide();
    }
};

iso.click = function (e) {

    if (hoverTile) {

        // move player
        player.setPosition(hoverTile.position.x, hoverTile.position.y);

        this.updateTransform();

        var pos = e.getLocalPosition(this);

        highlight.setPosition(pos);
    }
};