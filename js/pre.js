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