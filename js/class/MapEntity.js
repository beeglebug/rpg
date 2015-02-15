var MapEntity = function(x, y) {

    this.position = new PIXI.Point(x, y);

    this.sprite = null;
};

MapEntity.prototype.setPosition = function(x, y) {

    this.position.set(x, y);
    if(this.sprite) {
        this.sprite.position.set(x,y);
        mapToScreen(this.sprite.position);
    }

    map.resetVisibility();
    map.calculateVisibility(x, y, 2);
    renderLighting();
};