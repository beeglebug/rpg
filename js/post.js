camera.mousemove = function (e) {

    if(!this.stage.interactionManager.hitTest(this,e)) {
        highlight.hide();
        tooltip.clear();
        return;
    } else {
        highlight.show();
    }

    var pos = e.getLocalPosition(iso);

    pos.toMap();

    hoverTile = map.getTileAt(pos.x, pos.y);

    highlight.setTile(hoverTile);

    // todo move into camera code
    if(rightDrag) {

        e.getLocalPosition(this, rightCurrent);

        camera.scene.position.x += (rightCurrent.x - rightStart.x);
        camera.scene.position.y += (rightCurrent.y - rightStart.y);
    }

    tooltip.onMouseMove(e);
};

camera.click = function (e) {

    if (hoverTile && hoverTile.position.distanceTo(player.tile.position) < 1.5) {

        // move player
        player.setPosition(hoverTile.position.x, hoverTile.position.y);

        this.updateTransform();

        var pos = e.getLocalPosition(this);

        highlight.setPosition(pos);
    }
};

// todo move into camera code
var rightStart = new PIXI.Point();
var rightDrag = false;
var rightCurrent = new PIXI.Point();

iso.rightdown = function(e) {

    // save start position
    e.getLocalPosition(this, rightStart);

    rightDrag = true;

};

iso.rightup = function(e) {

    rightDrag = false;

};