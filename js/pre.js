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

