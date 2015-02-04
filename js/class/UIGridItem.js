var UIGridItem = function(texture, width, height, texture1x) {

    this.texture = texture;
    this.texture1x = texture1x;

    this.sprite = new PIXI.Sprite(this.texture);

    this.sprite.gridItem = this;

    this.width = width || 1;
    this.height = height || 1;
    
    this.position = new PIXI.Point();

    DragDrop.enable(this.sprite);
};

UIGridItem.prototype.shrink = function() {
    this.sprite.setTexture(this.texture1x);
};

UIGridItem.prototype.grow = function() {
    this.sprite.setTexture(this.texture);
};