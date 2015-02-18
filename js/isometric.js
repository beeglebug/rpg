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

// generate graphics
function generateIsoGraphics() {

    highlight.sprite = PIXI.Sprite.fromFrame('highlight.png');
    highlight.sprite.setAnchor(17, 0);
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
