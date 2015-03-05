// generate graphics
function generateIsoGraphics() {

    highlight.init();
    gridUI.addChild(highlight.sprite);

    player.sprite = PIXI.Sprite.fromFrame('man.png');
    player.sprite.setAnchor(3, 0);
    player.sprite.zIndex = 1;
    objects.addChild(player.sprite);

    var x, y, sprite, tile;

    // build floor layer
    for (y = 0; y < map.data.length; y++) {

        for (x = 0; x < map.data[0].length; x++) {

            tile = map.getTileAt(x, y);

            switch(tile.type) {
                case 'R':
                    tile.sprite = PIXI.Sprite.fromFrame('road.png');
                    break;
                case 'G':
                    tile.sprite = PIXI.Sprite.fromFrame('grass.png');
                    break;
                case 'H':
                    tile.sprite = PIXI.Sprite.fromFrame('grass.png');
                    sprite = PIXI.Sprite.fromFrame('house.png');
                    sprite.setAnchor(17, 15);
                    sprite.position.set(x, y);
                    sprite.zIndex = 0;
                    mapToScreen(sprite.position);
                    objects.addChild(sprite);
                    tile.objects.push(sprite);
                    //todo move this
                    tile.solid = true;
                    break;
                case 'T':
                    tile.sprite = PIXI.Sprite.fromFrame('grass.png');
                    sprite = PIXI.Sprite.fromFrame('trees.png');
                    sprite.setAnchor(17, 14);
                    sprite.position.set(x, y);
                    sprite.zIndex = 0;
                    mapToScreen(sprite.position);
                    objects.addChild(sprite);
                    tile.objects.push(sprite);
                    break;
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


// lighting
function renderLighting() {

    var x, y, tile;

    for (y = 0; y < map.data.length; y++) {
        for (x = 0; x < map.data[0].length; x++) {
            tile = map.data[y][x];
            setLighting(tile.sprite, tile.visibility);
            tile.objects.forEach(function (sprite) {
                setLighting(sprite, tile.visibility);
            });
        }
    }
}

// lighting
function setLighting(sprite, visibility) {

    switch (visibility) {
        // never seen
        case 0:
            sprite.visible = false;
            break;
        // previously seen
        case 1:
            sprite.tint = 0x555555;
            sprite.visible = true;
            break;
        // currently visible
        case 2:
            sprite.tint = 0xFFFFFF;
            sprite.visible = true;
            break;
    }

}

// map highlight
var highlight = {

    position: new PIXI.Point(),

    sprite: new PIXI.Sprite(),

    init : function() {

        this.sprite = PIXI.Sprite.fromFrame('highlight.png');
        this.sprite.setAnchor(17, 0);

    },

    setTile: function(tile) {

        if (tile) {
            this.move(tile.position);
            this.show();

            if(tile.visibility == 0) {
                this.sprite.alpha = 0.1;
            } else {
                this.sprite.alpha = 1;
            }

        } else {
            this.hide();
        }
    },

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

function generateMapData(width, height) {

    var data = [];
    for(var i = 0; i < height; i++) {
        data.push( row(width, 'G') );
    }

    var roadDensity = Math.round(height / 10); // 1 in 10
    var treeDensity = Math.round( (width * height) / 10 ); // 1 in 10
    var houseDensity = Math.round( (width * height) / 20 ); // 1 in 20

    var i, road;

    // roads
    for(i = 0; i < roadDensity; i++) {
        road = rng.randomIntBetween(0, height - 1);
        data[road] = row(width, 'R');
    }


    // houses
    for(i = 0; i < houseDensity; i++) {
        setRandomGrassTile('H')
    }

    // trees
    for(i = 0; i < treeDensity; i++) {
        setRandomGrassTile('T')
    }

    return data;

    function setRandomGrassTile(value) {

        var x = rng.randomIntBetween(0, height - 1);
        var y = rng.randomIntBetween(0, height - 1);

        if(data[y][x] !== 'G') {
            return setRandomGrassTile(value);
        }

        return data[y][x] = value;
    }

    function row(len, val) {
        var arr = [];
        for(var i = 0; i < len; i++) {
            arr.push(val);
        }
        return arr;
    }
}

