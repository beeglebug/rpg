// todo work out where looting code goes, probably player class
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



