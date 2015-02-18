var Mob = function(x, y) {

    this.position = new PIXI.Point(x, y);

    this.sprite = null;
    this.tile = null;
};

Mob.prototype.setPosition = function(x, y) {

    this.position.set(x, y);

    if(this.sprite) {
        this.sprite.position.set(x,y);
        mapToScreen(this.sprite.position);
    }

    if(this.tile) {
        this.exitTile(this.tile);
    }

    this.tile = map.getTileAt(x, y);

    this.enterTile(this.tile);
};


Mob.prototype.enterTile = function(tile) {

};

Mob.prototype.exitTile = function(tile) {

};
