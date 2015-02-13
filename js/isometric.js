var iso = new PIXI.DisplayObjectContainer();
stage.addChild(iso);

PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;
iso.scale.set(2,2);

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

    //highlight.move(pos);
};

// 1

var x, y, type, map = [];

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

        var tile = getTileAt(pos);

        if(tile) {
            tile.addChildAt(this.base, 1);
            tile.addChildAt(this.back, 2);
            tile.addChild(this.front);
        }
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

    highlight.base = PIXI.Sprite.fromFrame('highlight_base.png');
    highlight.back = PIXI.Sprite.fromFrame('highlight_back.png');
    highlight.front = PIXI.Sprite.fromFrame('highlight_front.png');

    setPixelAnchor(highlight.base, 17, 17);
    setPixelAnchor(highlight.back, 17, 17);
    setPixelAnchor(highlight.front, 17, 17);

    //iso.addChild(highlight.base);
    //iso.addChild(highlight.back);
    //iso.addChild(highlight.front);

    marker = PIXI.Sprite.fromFrame('marker.png');
    setPixelAnchor(marker, 7, 0);
    marker.position.y = -20;

    man = PIXI.Sprite.fromFrame('man.png');
    man.mapPosition = new PIXI.Point();
    man.mapPosition.z = 1;
    man.name = 'man';
    setPixelAnchor(man, 2, 1);
    iso.addChild(man);

    tween = new TWEEN.Tween(marker.position).to({ y : -16 }, 500).repeat(Infinity).yoyo(true).start();

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

            iso.addChild(tile);
            tile.position.set(x, y);
            tile.mapPosition = new PIXI.Point(x,y);
            tile.mapPosition.z = 0;
            mapToScreen(tile.position);

            tile.type = map[y][x];
            map[y][x] = tile;
        }
    }

    x = 0; y = 1;
    sprite = PIXI.Sprite.fromFrame('house.png');
    sprite.name = 'house';
    setPixelAnchor(sprite, 17, 17);
    iso.addChild(sprite);
    sprite.position.set(x, y);
    sprite.mapPosition = new PIXI.Point(x,y);
    sprite.mapPosition.z = 1;
    mapToScreen(sprite.position);

    x = 1; y = 1;
    sprite = PIXI.Sprite.fromFrame('trees.png');
    sprite.name = 'trees';
    setPixelAnchor(sprite, 17, 17);
    iso.addChild(sprite);
    sprite.position.set(x, y);
    sprite.mapPosition = new PIXI.Point(x,y);
    sprite.mapPosition.z = 1;
    mapToScreen(sprite.position);

    tween = new TWEEN.Tween(man.mapPosition).to({ x : 4, y : 4 }, 5000).start();

    //map[4][4].addChild(marker);
    requestAnimFrame( animate );
}

function isoUpdate() {

    if(man) {
        man.position.set(man.mapPosition.x, man.mapPosition.y);
        mapToScreen(man.position);
    }

    sortIso(iso);
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