var Camera = function(width, height, displayObject) {

    PIXI.DisplayObjectContainer.call(this);

    this.child = displayObject;

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
    this.addChild(displayObject);

    this.mask = mask;

    this.center = new PIXI.Point(width/2, height/2);
    this.target = new PIXI.Point();
    this.offset = new PIXI.Point();

};

Camera.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);


Camera.prototype.setTarget = function(pos) {

    this.target.set(pos.x, pos.y);

    this.offset.set(pos.x, pos.y);

    mapToScreen(this.offset);

    this.child.position.set(
        this.center.x - this.offset.x,
        this.center.y - this.offset.y
    );

};