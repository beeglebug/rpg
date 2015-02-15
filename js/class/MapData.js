var MapData = function (data) {

    this.data = [];

    this.width = data[0].length;
    this.height = data.length;

    var x, y;

    for (y = 0; y < this.height; y++) {
        this.data[y] = [];
        for (x = 0; x < this.width; x++) {
            this.data[y][x] = new MapTile(data[y][x], x, y);
        }
    }
}

MapData.prototype.getTileAt = function (x, y) {

    // check bounds
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
        return null;
    }

    return this.data[y][x];
};

MapData.prototype.getTilesInRange = function (x, y, range) {

    var minX = x - range;
    var minY = y - range;
    var maxX = x + range;
    var maxY = y + range;

    if (minX < 0) {
        minX = 0;
    }
    if (minY < 0) {
        minY = 0;
    }
    if (maxX >= this.width) {
        maxX = this.width - 1;
    }
    if (maxY >= this.height) {
        maxY = this.height - 1;
    }

    var ix, iy, dx, dy, tile, tiles = [];

    for (iy = minY; iy <= maxY; iy++) {
        for (ix = minX; ix <= maxX; ix++) {

            tile = this.data[iy][ix];

            dx = Math.abs(x - tile.position.x);
            dy = Math.abs(y - tile.position.y);

            if ((dx * dx) + (dy * dy) <= (range * range)) {
                tiles.push(tile);
            }
        }
    }

    return tiles;
};


MapData.prototype.calculateVisibility = function (x, y, range) {

    // get all the tiles in the range
    var tiles = this.getTilesInRange(x, y, range);

    // we can always see the tile we are on
    this.data[y][x].visibility = MapTile.VISIBILITY_VISIBLE;

    var line = new Line();

    tiles.forEach(function (tile) {

        // do a bresenhams line
        var points = line.calculate(x, y, tile.position.x, tile.position.y);

        var i, ix, iy, tileAtPoint;

        // skip the first part of the line (its the tile we are on)
        for (i = 1; i < points.length; i++) {

            ix = points[i][0];
            iy = points[i][1];

            tileAtPoint = this.data[iy][ix];

            tileAtPoint.visibility = MapTile.VISIBILITY_VISIBLE;

            // stop when we hit something solid
            if (tileAtPoint.solid == true) {
                break;
            }
        }

    }.bind(this));

};


MapData.prototype.resetVisibility = function () {

    var x, y, tile;

    for (y = 0; y < this.height; y++) {

        for (x = 0; x < this.width; x++) {

            tile = this.data[y][x];

            if (tile.visibility == MapTile.VISIBILITY_VISIBLE) {
                tile.visibility = MapTile.VISIBILITY_PREVIOUS;
            }


        }
    }
};