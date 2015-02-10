function generateMap(width, height) {

    var data = [];
    var x, y, tile, type;

    for(y = 0; y < height; y++) {

        data[y] = [];

        for (x = 0; x < width; x++) {

            type = MapTile.TYPE_NULL;

            if(x > 0 && x < width - 1 && y > 0 && y < height - 1) {

                type = MapTile.TYPE_GRASS;

                if(y === Math.floor(height/2)) {

                    type = MapTile.TYPE_ROAD;

                }

            }

            tile = new MapTile(type);

            data[y][x] = tile;
        }
    }
    
    return new MapData(data);
    
}