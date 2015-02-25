function generateMapData(width, height) {

    var data = [];
    for(var i = 0; i < height; i++) {
        data.push( row(width, 'G') );
    }

    var road = rng.randomIntBetween(0, data.length - 1);

    data[road] = row(width, 'R');

    function setRandomGrassTile(value) {

        var x = rng.randomIntBetween(0, data.length - 1);
        var y = rng.randomIntBetween(0, data.length - 1);

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

    // three houses
    for(var i = 0; i < 3; i++) {
        setRandomGrassTile('H')
    }

    // three trees
    for(var i = 0; i < 3; i++) {
        setRandomGrassTile('T')
    }

    return data;
}

