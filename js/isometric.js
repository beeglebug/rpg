var iso = new PIXI.DisplayObjectContainer();
stage.addChild(iso);

var floor = new PIXI.DisplayObjectContainer();
var grid = new PIXI.DisplayObjectContainer();
var gridUI = new PIXI.DisplayObjectContainer();
var objects = new PIXI.DisplayObjectContainer();

iso.addChildren([floor, grid, gridUI, objects]);
iso.scale.set(2);

grid.alpha = 0.05;

PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

var loader = new PIXI.AssetLoader([
    './img/tiles.json',
    './img/ui.json'
]);

loader.addEventListener('onComplete', draw);
loader.load();

ISO_TILE_WIDTH = 32;
ISO_TILE_HEIGHT = 16;
ISO_TILE_WIDTH_HALF = ISO_TILE_WIDTH / 2;
ISO_TILE_HEIGHT_HALF = ISO_TILE_HEIGHT / 2;

var player = new MapEntity();

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
        tileClicked(hoverTile);
    }

};

function tileClicked(tile) {

    // move player
    player.setPosition(tile.position.x, tile.position.y);
}

var x, y, map = [];

var data = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [2, 2, 2, 2, 2],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
];

var map = new MapData(data);

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

    var h1 = makeHouse(0, 1);
    objects.addChild(h1.sprite);
    var h2 = makeHouse(1, 1);
    objects.addChild(h2.sprite);
    var h3 = makeHouse(1, 0);
    objects.addChild(h3.sprite);
    var h4 = makeHouse(4, 3);
    objects.addChild(h4.sprite);
    var t1 = makeTrees(2, 1);
    objects.addChild(t1.sprite);
    var t2 = makeTrees(3, 4);
    objects.addChild(t2.sprite);

    map.getTileAt(1,1).solid = true;
    map.getTileAt(0,1).solid = true;
    map.getTileAt(1,0).solid = true;

    player.setPosition(2, 2);
}

function isoUpdate() {

    sortIso(objects);
}

function mapToScreen(map) {

    map.set(
        (map.x - map.y) * ISO_TILE_WIDTH_HALF,
        (map.x + map.y) * ISO_TILE_HEIGHT_HALF
    );

    return map;
}

function screenToMap(screen) {

    screen.set(
        Math.floor((screen.x / ISO_TILE_WIDTH_HALF + screen.y / ISO_TILE_HEIGHT_HALF) / 2),
        Math.floor((screen.y / ISO_TILE_HEIGHT_HALF - (screen.x / ISO_TILE_WIDTH_HALF)) / 2)
    );

    return screen;
}


function sortIso(displayObject) {

    var zA, zB;

    displayObject.children.sort(function (a, b) {

        zA = a.position.x + a.position.y + (a.zIndex / 10);
        zB = b.position.x + b.position.y + (b.zIndex / 10);

        return zA - zB;
    });
}


function makeHouse(x, y) {

    var entity = new MapEntity(x, y);
    entity.sprite = PIXI.Sprite.fromFrame('house.png');
    entity.sprite.setAnchor(17, 15);
    entity.sprite.position.set(x, y);
    entity.sprite.zIndex = 0;
    mapToScreen(entity.sprite.position);
    var tile = map.getTileAt(x, y);
    tile.entities.push(entity);
    return entity;
}

function makeTrees(x, y) {

    var entity = new MapEntity(x, y);
    entity.sprite = PIXI.Sprite.fromFrame('trees.png');
    entity.sprite.setAnchor(17, 14);
    entity.sprite.position.set(x, y);
    entity.sprite.zIndex = 0;
    mapToScreen(entity.sprite.position);
    var tile = map.getTileAt(x, y);
    tile.entities.push(entity);
    return entity;
}

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