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
                    sprite.position.toScreen();
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
                    sprite.position.toScreen();
                    objects.addChild(sprite);
                    tile.objects.push(sprite);
                    break;
            }

            tile.position.set(x, y);
            tile.sprite.position.set(x, y);
            tile.sprite.setAnchor(17, 0);
            tile.sprite.position.toScreen();
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
            gridTile.position.toScreen();
            grid.addChild(gridTile);
        }
    }

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

        this.sprite.position.toScreen();
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