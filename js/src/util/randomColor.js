/* jshint node: true */
'use strict';

function randomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '0x';
    for (var i = 0; i < 6; i++ ) {
        color += letters[rng.randomIntBetween(0,15)];
    }
    return color;
}

module.exports = randomColor;