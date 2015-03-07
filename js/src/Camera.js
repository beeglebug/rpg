/* jshint node: true */
'use strict';

var PIXI = require('pixi');

var Camera = function(width, height, displayObject) {

    PIXI.DisplayObjectContainer.call(this);

    this.interactive = true;

    this.scene = displayObject;

    this.scene.hitArea = new PIXI.Rectangle(0,0, width, height);

    this.zoom = 1;

    var background = new PIXI.Graphics();
    background.beginFill(0x000000);
    background.drawRect(0, 0, width, height);
    background.endFill();

    var mask = new PIXI.Graphics();
    mask.beginFill();
    mask.drawRect(0, 0, width, height);
    mask.endFill();

    this.addChild(background);
    this.addChild(mask);
    this.addChild(this.scene);

    this.mask = mask;

    this.center = new PIXI.Point(width/2, height/2);
    this.target = new PIXI.Point();
    this.offset = new PIXI.Point();

    // set up dragging
    this.dragging = false;
    this.dragStart = new PIXI.Point();
    this.dragCurrent = new PIXI.Point();

    var self = this;

    this.scene.rightdown = function(e) {

        // save start position
        e.getLocalPosition(this, self.dragStart);
        self.dragging = true;
    };

    this.scene.rightup = function(e) {

        self.dragging = false;
    };


    this.mousemove = function (e) {

        // todo emit mouseentercamera and mouseleavecamera events
        if(!this.stage.interactionManager.hitTest(this, e)) {
            //highlight.hide();
            //tooltip.clear();
            return;
        } else {
            //highlight.show();
        }

        var pos = e.getLocalPosition(self.scene);

        pos.toMap();

        //hoverTile = map.getTileAt(pos.x, pos.y);
        //highlight.setTile(hoverTile);

        if(self.dragging) {
            e.getLocalPosition(this, self.dragCurrent);
            camera.scene.position.x += (self.dragCurrent.x - self.dragStart.x);
            camera.scene.position.y += (self.dragCurrent.y - self.dragStart.y);
        }

        // todo listen to emmited events
        //tooltip.onMouseMove(e);
    };

    this.click = function (e) {

        // todo emit event

        //if (hoverTile && hoverTile.position.distanceTo(player.tile.position) < 1.5) {
        //
        //    // move player
        //    player.setPosition(hoverTile.position.x, hoverTile.position.y);
        //
        //    this.updateTransform();
        //
        //    var pos = e.getLocalPosition(this);
        //
        //    highlight.setPosition(pos);
        //}
    };

};

Camera.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);


Camera.prototype.setTarget = function(pos) {

    this.target.set(pos.x, pos.y);

    this.offset.set(pos.x, pos.y);

    this.offset.toScreen();

    this._reposition();
};

/**
 * @private
 */
Camera.prototype._reposition = function() {

    this.scene.position.set(
        this.center.x - (this.offset.x * this.zoom),
        this.center.y - (this.offset.y * this.zoom)
    );

};

Camera.prototype.setZoom = function(level) {

    this.zoom = level;

    this.scene.scale.set(this.zoom);

    this._reposition();
};

module.exports = Camera;