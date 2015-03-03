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
var data = generateMapData(50,50);
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

grid.alpha = 0.05;

var camera = new Camera(480, 270, iso);
stage.addChild(camera);
stage.addChild(ui);

camera.setZoom(2);

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

// ui experiments
var floorInventoryUI = new InventoryUI(new Inventory(7,7), 24, 24);
floorInventoryUI.position.set(500, 50);
ui.addChild(floorInventoryUI);

var playerInventoryUI = new InventoryUI(player.inventory, 24, 24);
playerInventoryUI.position.set(500, 250);
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
    'font/munro-11-white.fnt',
    'font/munro-11-black.fnt',
    'img/tiles.json',
    'img/ui.json',
    'data/tile-types.json'
]);

var jsonData = {};

loader.addEventListener('onComplete', assetsLoaded);
loader.addEventListener('onProgress', function(e){
    if(e.content.loader.json && e.content.loader.baseUrl == 'data/') {
        //todo save data globally
        console.log(1);
    }
});
loader.load();



function assetsLoaded(e) {

    var btn = new Button('search', searchCurrentTile);
    ui.addChild(btn);
    btn.position.set(500, 10);

    var btn = new Button('take all', takeAllLoot);
    ui.addChild(btn);
    btn.position.set(540, 10);

    tileInfo = new TileInfo();
    ui.addChild(tileInfo);
    tileInfo.position.set(10,300);

    tooltip = new Tooltip();
    ui.addChild(tooltip);
    tooltip.position.set(200, 300);

    generateIsoGraphics();

    player.setPosition(
        Math.floor(map.width / 2),
        Math.floor(map.height / 2)
    );

    searchCurrentTile();

    camera.setTarget(player.position);

    requestAnimFrame(animate);
}

function searchCurrentTile() {

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

    player.tile.inventory.moveAllTo(player.inventory);

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

camera.mousemove = function (e) {

    if(!this.stage.interactionManager.hitTest(this,e)) {
        highlight.hide();
        tooltip.clear();
        return;
    } else {
        highlight.show();
    }

    var pos = e.getLocalPosition(iso);

    screenToMap(pos);

    hoverTile = map.getTileAt(pos.x, pos.y);

    highlight.setTile(hoverTile);

    // todo move into camera code
    if(rightDrag) {

        e.getLocalPosition(this, rightCurrent);

        camera.scene.position.x += (rightCurrent.x - rightStart.x);
        camera.scene.position.y += (rightCurrent.y - rightStart.y);
    }

    tooltip.onMouseMove(e);
};

camera.click = function (e) {

    if (hoverTile && hoverTile.position.distanceTo(player.tile.position) < 1.5) {

        // move player
        player.setPosition(hoverTile.position.x, hoverTile.position.y);

        this.updateTransform();

        var pos = e.getLocalPosition(this);

        highlight.setPosition(pos);
    }
};

// todo move into camera code
var rightStart = new PIXI.Point();
var rightDrag = false;
var rightCurrent = new PIXI.Point();

iso.rightdown = function(e) {

    // save start position
    e.getLocalPosition(this, rightStart);

    rightDrag = true;

};

iso.rightup = function(e) {

    rightDrag = false;

};