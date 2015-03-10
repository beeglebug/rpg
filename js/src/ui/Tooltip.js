/* jshint node: true */
'use strict';

var PIXI = require('pixi');

var Tooltip = function() {

    PIXI.DisplayObjectContainer.call(this);

    this.background = new PIXI.Graphics();

    this.text = new PIXI.BitmapText('tooltip', { font: "munro-11-white" });

    this.addChild(this.background);
    this.addChild(this.text);

    this.delay = 500;
    this.margin = 5;
    this.offset = new PIXI.Point(3,3);

    this.text.position.set(this.margin, this.margin);

    this.visible = false;

    this.setText('tooltip');
};

Tooltip.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);

Tooltip.prototype.setText = function(text) {

    this.text.setText(text);
    // immediate update (to get measurements)
    this.text.updateText();
    this.text.dirty = false;

    this.backgroundWidth = this.text.textWidth + (this.margin * 2);
    this.backgroundHeight = this.text.textHeight + (this.margin * 2);

    this.background.clear();
    this.background.beginFill(0x222222);
    this.background.drawRect(0, 0, this.backgroundWidth, this.backgroundHeight);

};

Tooltip.prototype.onMouseMove = function(e) {

    this.clear();

    var self = this;

    this.timeout = setTimeout(function() {
        self.update(e);
    }, this.delay);
};

Tooltip.prototype.clear = function() {

    this.visible = false;

    clearTimeout(this.timeout);
};

Tooltip.prototype.update = function(e) {

    // no tooltip for you
    if(hoverTile.visibility == MapTile.VISIBILITY_NONE) { return; }

    var text = hoverTile.type;

    if(hoverTile.visibility == MapTile.VISIBILITY_VISIBLE && hoverTile.inventory.items.length) {
        text += ' (' + pluralize('items', hoverTile.inventory.items.length, true) + ')';
    }

    this.setText(text);

    var pos = e.getLocalPosition(this.parent);

    this.position.set(
        pos.x + this.offset.x,
        pos.y - this.backgroundHeight - this.offset.y
    );

    this.visible = true;
};

module.exports = new Tooltip();