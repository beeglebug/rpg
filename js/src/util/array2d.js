/* jshint node: true */
'use strict';

function array2d(width, height, fill) {

    var x, y, arr = [];

    for (y = 0; y < width; y++) {
        arr[y] = [];
        for (x = 0; x < height; x++) {
            arr[y][x] = fill;
        }
    }

    return arr;
}

module.exports = array2d;