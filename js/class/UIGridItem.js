var UIGridItem = function(texture, width, height) {

    this.texture = PIXI.Texture.fromImage(texture);

    this.sprite = new PIXI.Sprite(this.texture);

    this.sprite.gridItem = this;

    this.width = width || 1;
    this.height = height || 1;
    
    this.position = new PIXI.Point();

    DragDrop.enable(this.sprite);
};