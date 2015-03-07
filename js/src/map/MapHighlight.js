/* jshint node: true */
'use strict';

var PIXI = require('pixi');

//todo remove and just handle in maprenderer
var MapHighlight = function() {

    this.position = new PIXI.Point();
    this.sprite = PIXI.Sprite.fromFrame('highlight.png');
    this.sprite.setAnchor(17, 0);
};

MapHighlight.prototype.setTile = function(tile) {

    if (tile) {

        this.move(tile.position);
        this.show();

        if(tile.visibility == 0) {
            this.sprite.alpha = 0.1;
        } else {
            this.sprite.alpha = 1;
        }

    } else {
        this.hide();
    }
};

MapHighlight.prototype.move = function (pos) {

    if (this.position.equals(pos)) {
        return;
    }

    this.setPosition(pos);
};

MapHighlight.prototype.setPosition = function (pos) {

    this.position.set(pos.x, pos.y);

    this.sprite.position.set(pos.x, pos.y);

    this.sprite.position.toScreen();
};

MapHighlight.prototype.show = function () {
    this.sprite.visible = true;
};

MapHighlight.prototype.hide = function () {
    this.sprite.visible = false;
};

module.exports = MapHighlight;