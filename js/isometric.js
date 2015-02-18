PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

// build display list
var iso = new PIXI.DisplayObjectContainer();
var floor = new PIXI.DisplayObjectContainer();
var grid = new PIXI.DisplayObjectContainer();
var gridUI = new PIXI.DisplayObjectContainer(); // highlights etc
var objects = new PIXI.DisplayObjectContainer();

iso.addChildren([floor, grid, gridUI, objects]);
stage.addChild(iso);

iso.scale.set(2);
grid.alpha = 0.05;

var loader = new PIXI.AssetLoader([
    './img/tiles.json',
    './img/ui.json'
]);

var rng = new RNG();

loader.addEventListener('onComplete', draw);
loader.load();

ISO_TILE_WIDTH = 32;
ISO_TILE_HEIGHT = 16;
ISO_TILE_WIDTH_HALF = ISO_TILE_WIDTH / 2;
ISO_TILE_HEIGHT_HALF = ISO_TILE_HEIGHT / 2;

var player = new Player();

var offset = new PIXI.Point(200, 100);
iso.position.add(offset);
iso.interactive = true;

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
    }

};


var x, y, map = [];

var data = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
];

var road = rng.randomIntBetween(0,4);

data[road] = [2,2,2,2,2];

var map = new MapData(data);

// map highlight
var highlight = {

    position: new PIXI.Point(),

    sprite: new PIXI.Sprite(),

    move: function (pos) {

        if (this.position.equals(pos)) {
            return;
        }

        this.setPosition(pos);
    },

    setPosition: function (pos) {

        this.position.set(pos.x, pos.y);

        this.sprite.position.set(pos.x, pos.y);

        mapToScreen(this.sprite.position);
    },

    show: function () {
        this.sprite.visible = true;
    },

    hide: function () {
        this.sprite.visible = false;
    }
};

// generate graphics
function draw() {

    highlight.sprite = PIXI.Sprite.fromFrame('highlight.png');
    highlight.sprite.setAnchor(16, 0);
    highlight.sprite.animationSpeed = 0.05;
    gridUI.addChild(highlight.sprite);
    highlight.hide();

    player.sprite = PIXI.Sprite.fromFrame('man.png');
    player.sprite.setAnchor(3, 0);
    player.sprite.zIndex = 1;
    objects.addChild(player.sprite);

    var x, y, sprite, tile;

    // build floor layer
    for (y = 0; y < map.data.length; y++) {

        for (x = 0; x < map.data[0].length; x++) {

            tile = map.getTileAt(x, y);

            if (tile.type == 2) {
                tile.sprite = PIXI.Sprite.fromFrame('road.png');
            } else {
                tile.sprite = PIXI.Sprite.fromFrame('grass.png');
            }

            tile.position.set(x, y);
            tile.sprite.position.set(x, y);
            tile.sprite.setAnchor(17, 0);
            mapToScreen(tile.sprite.position);
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
            mapToScreen(gridTile.position);
            grid.addChild(gridTile);
        }
    }

    var object, x, y;

    for(var i = 0; i < 3; i++) {
        x = rng.randomIntBetween(0,4);
        y = rng.randomIntBetween(0,4);
        while(y == road) {
            y = rng.randomIntBetween(0, 4);
        }
        object = makeHouse(x, y);
        objects.addChild(object.sprite);
        map.getTileAt(x, y).solid = true;
    }

    for(var i = 0; i < 3; i++) {
        x = rng.randomIntBetween(0,4);
        y = rng.randomIntBetween(0,4);
        while(y == road) {
            y = rng.randomIntBetween(0, 4);
        }
        object = makeTrees(x, y);
        objects.addChild(object.sprite);
    }

    player.setPosition(2, 2);
}

// isometric functions
function isoUpdate() {

    sortIso(objects);
}

// isometric functions
function mapToScreen(map) {

    map.set(
        (map.x - map.y) * ISO_TILE_WIDTH_HALF,
        (map.x + map.y) * ISO_TILE_HEIGHT_HALF
    );

    return map;
}

// isometric functions
function screenToMap(screen) {

    screen.set(
        Math.floor((screen.x / ISO_TILE_WIDTH_HALF + screen.y / ISO_TILE_HEIGHT_HALF) / 2),
        Math.floor((screen.y / ISO_TILE_HEIGHT_HALF - (screen.x / ISO_TILE_WIDTH_HALF)) / 2)
    );

    return screen;
}

// isometric functions
function sortIso(displayObject) {

    var zA, zB;

    displayObject.children.sort(function (a, b) {

        zA = a.position.x + a.position.y + (a.zIndex / 10);
        zB = b.position.x + b.position.y + (b.zIndex / 10);

        return zA - zB;
    });
}

// map generation
function makeHouse(x, y) {

    // todo dont use mob
    var entity = new Mob(x, y);
    entity.sprite = PIXI.Sprite.fromFrame('house.png');
    entity.sprite.setAnchor(17, 15);
    entity.sprite.position.set(x, y);
    entity.sprite.zIndex = 0;
    mapToScreen(entity.sprite.position);
    var tile = map.getTileAt(x, y);
    tile.entities.push(entity);
    return entity;
}

// map generation
function makeTrees(x, y) {

    // todo dont use mob
    var entity = new Mob(x, y);
    entity.sprite = PIXI.Sprite.fromFrame('trees.png');
    entity.sprite.setAnchor(17, 14);
    entity.sprite.position.set(x, y);
    entity.sprite.zIndex = 0;
    mapToScreen(entity.sprite.position);
    var tile = map.getTileAt(x, y);
    tile.entities.push(entity);
    return entity;
}

// lighting
function renderLighting() {

    var x, y, tile;

    for (y = 0; y < map.data.length; y++) {
        for (x = 0; x < map.data[0].length; x++) {
            tile = map.data[y][x];
            setLighting(tile.sprite, tile.visibility);
            tile.entities.forEach(function (entity) {
                setLighting(entity.sprite, tile.visibility);
            });
        }
    }
}

// lighting
function setLighting(sprite, visibility) {

    switch (visibility) {
        case 0:
            sprite.tint = 0x000000;
            break;
        case 1:
            sprite.tint = 0x999999;
            break;
        case 2:
            sprite.tint = 0xFFFFFF;
            break;
    }

}

// todo keep player tile centered
function centerMap() {

}

var floorInventory = new Inventory(7,7);

var floorInventoryUI = new InventoryUI(floorInventory, 24, 24);
floorInventoryUI.graphics.position.set(400,50);
ui.addChild(floorInventoryUI.graphics);

stage.addChild(ui);
