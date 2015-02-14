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

var offset = new PIXI.Point(200, 100);
iso.position.add(offset);
iso.interactive = true;

iso.mousemove = function (e) {

    var pos = e.getLocalPosition(this);

    screenToMap(pos);

    highlight.move(pos);
};


var x, y, map = [];

map = [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [2,2,2,2,2],
    [0,0,0,0,0],
    [0,0,0,0,0],
];

var highlight = {

    position: new PIXI.Point(),

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
    }

};

function getTileAt(pos) {

    if(
        pos.y < 0 || pos.y >= map.length ||
        pos.x < 0 || pos.x >= map[pos.y].length
    ) {
        return null;
    }

    return map[pos.y][pos.x];
}

var marker, tween, man;

function draw() {

    highlight.sprite = PIXI.Sprite.fromFrame('highlight.png');
    setPixelAnchor(highlight.sprite, 17, 17);
    gridUI.addChild(highlight.sprite);

    man = PIXI.Sprite.fromFrame('man.png');
    man.mapPosition = new PIXI.Point(2,2);
    man.mapPosition.z = 2;
    man.name = 'man';
    setPixelAnchor(man, 3, 0);
    objects.addChild(man);

    //tween = new TWEEN.Tween(marker.position).to({ y : -16 }, 500).repeat(Infinity).yoyo(true).start();

    var x, y, sprite, tile;

    for (y = 0; y < map.length; y++) {

        for (x = 0; x < map[0].length; x++) {

            if (map[y][x] == 2) {
                tile = PIXI.Sprite.fromFrame('road.png');
                tile.name = 'road';
                setPixelAnchor(tile, 17, 0);
            } else {
                tile = PIXI.Sprite.fromFrame('grass.png');
                tile.name = 'grass';
                setPixelAnchor(tile, 17, 0);
            }

            floor.addChild(tile);
            tile.position.set(x, y);
            tile.mapPosition = new PIXI.Point(x,y);
            tile.mapPosition.z = 0;
            mapToScreen(tile.position);

            tile.type = map[y][x];
            map[y][x] = tile;
        }
    }

    for (y = 0; y < map.length; y++) {

        for (x = 0; x < map[0].length; x++) {

            tile = PIXI.Sprite.fromFrame('grid.png');
            setPixelAnchor(tile,17,0);
            tile.position.set(x, y);
            mapToScreen(tile.position);
            grid.addChild(tile);
        }
    }

    var h1 = makeHouse(0,1);
    var h2 = makeHouse(1,1);
    var h3 = makeHouse(1,0);
    var h4 = makeHouse(4,3);
    var t1 = makeTrees(2,1);
    var t2 = makeTrees(3,4);


    map[0][0].tint = 0x000000;
    map[1][1].tint = 0xCCCCCC;

    map[0][1].tint = 0xCCCCCC;
    map[0][2].tint = 0xCCCCCC;
    map[0][3].tint = 0xCCCCCC;
    map[0][4].tint = 0xCCCCCC;

    map[1][0].tint = 0xCCCCCC;
    map[2][0].tint = 0xCCCCCC;
    map[3][0].tint = 0xCCCCCC;
    map[4][0].tint = 0xCCCCCC;

    h1.tint = 0xCCCCCC;
    h2.tint = 0xCCCCCC;
    h3.tint = 0xCCCCCC;

    //tween = new TWEEN.Tween(man.mapPosition).to({ x : 4, y : 4 }, 5000).start();

    //map[4][4].addChild(marker);
    requestAnimFrame( animate );
}

function isoUpdate() {

    if(man) {
        man.position.set(man.mapPosition.x, man.mapPosition.y);
        mapToScreen(man.position);
    }

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

function setPixelAnchor(sprite, x, y) {

    sprite.anchor.set(
        x / sprite.width,
        y / sprite.height
    );

    return sprite;
}

function sortIso(displayObject) {

    var zA, zB;

    displayObject.children.sort(function(a, b) {

        zA = a.mapPosition.x + a.mapPosition.y + ( a.mapPosition.z / 10 );
        zB = b.mapPosition.x + b.mapPosition.y + ( b.mapPosition.z / 10 );

        return zA - zB;
    });
}


function makeHouse(x, y) {

    var sprite = PIXI.Sprite.fromFrame('house.png');
    sprite.name = 'house';
    setPixelAnchor(sprite, 17, 15);
    objects.addChild(sprite);
    sprite.position.set(x, y);
    sprite.mapPosition = new PIXI.Point(x,y);
    sprite.mapPosition.z = 1;
    mapToScreen(sprite.position);
    return sprite;
}

function makeTrees(x,y) {

    var sprite = PIXI.Sprite.fromFrame('trees.png');
    sprite.name = 'trees';
    setPixelAnchor(sprite, 17, 14);
    objects.addChild(sprite);
    sprite.position.set(x, y);
    sprite.mapPosition = new PIXI.Point(x,y);
    sprite.mapPosition.z = 1;
    mapToScreen(sprite.position);
    return sprite;
}

