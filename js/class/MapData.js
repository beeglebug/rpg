var MapData = function(data) {
    
    this.data = data;
    this.width = this.data[0].length;
    this.height = this.data.length;
    
};

MapData.prototype.getTileAt = function(x, y) {

    // check bounds
    if(x < 0 || y < 0 || x >= this.width || y >= this.height) { return null; }

    return this.data[y][x];
};

MapData.prototype.getTilesInRange = function(x, y, range) {
    
    var minX = x - range;
    var minY = y - range;
    var maxX = x + range;
    var maxY = y + range;
        
    if(minX < 0) { minX = 0; }
    if(minY < 0) { minY = 0; }
    if(maxX >= this.width) { maxX = this.width - 1; }
    if(maxY >= this.height) { maxY = this.height - 1; }
    
    var ix, iy, dx, dy, tile, tiles = [];
    
    for(iy = minY; y <= maxY; iy++) {
        for(ix = minX; x <= maxX; ix++) {

            tile = this.data[iy][ix];

            dx = Math.abs(x - tile.position.x);
            dy = Math.abs(y - tile.position.y);

            if((dx * dx) + (dy * dy) < range) {
                tiles.push(tile);
            }
        }
    }
    
    return tiles;
};


MapData.prototype.calculateVisibility = function(x, y, range) {

    // get all the tiles in the range
    var tiles = this.getTilesInRange(x, y, range);
 
    // we can always see the tile we are on
    this.data[y][x].canSee = true;
    this.data[y][x].seen = true;
    
    var line = new Line();
    
    tiles.forEach(function(tile) {

        // do a bresenhams line
        var line = line.calculate(x, y, tile.position.x, tile.position.y);

        var i, ix, iy, lineTile;

        // skip the first part of the line (its the tile we are on)
        for(i = 1; i < line.length; i++) {
            
            ix = line[i][0];
            iy = line[i][1];
            
            lineTile = this.data[iy][ix];
        
            // TODO use flags
            lineTile.canSee = true;
            lineTile.seen = true;

            // stop when we hit something solid
            if(lineTile.visibility == 1) {
                break;
            }
        }
        
    }.bind(this));
    
};


// reset everything back to can't see before running los
MapData.prototype.resetLighting = function() {
    
    var x, y, tile; 
    
    for(y = 0; y < this.height; y++) {
        
        for(x = 0; x < this.width; x++) { 
            
            tile = this.data[y][x];
            tile.canSee = false;
        }
    }
};