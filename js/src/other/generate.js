function generateMapData() {

    var x, y;

    var data = [
        'GGGGG',
        'GGGGG',
        'GGGGG',
        'GGGGG',
        'GGGGG'
    ];

    var road = rng.randomIntBetween(0, 4);

    data[road] = 'RRRRR';

    data = data.map(function(row){
        return row.split('');
    });

    var object, x, y;

    function setRandomGrassTile(value) {

        var x = rng.randomIntBetween(0, data.length - 1);
        var y = rng.randomIntBetween(0, data.length - 1);

        if(data[y][x] !== 'G') {
            return setRandomGrassTile(value);
        }

        return data[y][x] = value;
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