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

