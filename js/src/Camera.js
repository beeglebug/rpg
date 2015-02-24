var Camera = function(displayObject) {

    PIXI.DisplayObjectContainer.call(this);

    this.addChild(displayObject);

    this.target = null;
};

Camera.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);


Camera.prototype.setTarget = function(target) {

    this.target = target;

};