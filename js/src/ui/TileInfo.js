var TileInfo = function() {

    PIXI.DisplayObjectContainer.call(this);

    this.tile = null;

    this.background = new PIXI.Graphics();
    this.background.beginFill(0xBBBBBB);
    this.background.drawRect(0, 0, 100, 35);

    this.typeText = new PIXI.BitmapText('type', { font: "munro-11-black", align : 'center' });
    this.searchedText = new PIXI.BitmapText('searched', { font: "munro-11-black", align : 'center' });

    this.typeText.position.set(5, 5);
    this.searchedText.position.set(5, 20);

    this.addChild(this.background);
    this.addChild(this.typeText);
    this.addChild(this.searchedText);
};

TileInfo.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);

TileInfo.prototype.setTile = function(tile) {

    this.tile = tile;

    // update text
    this.typeText.setText('type: ' + tile.type);
    this.searchedText.setText('not searched');
};