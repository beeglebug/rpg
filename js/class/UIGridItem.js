//todo get rid of texture1x and shrink/grow stuff for now
var UIGridItem = function(texture, width, height, texture1x) {

    this.texture = PIXI.Texture.fromImage(texture);
    this.texture1x = PIXI.Texture.fromImage(texture1x);

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