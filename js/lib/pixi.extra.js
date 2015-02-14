PIXI.Point.prototype.add = function(point) {

    this.x += point.x;
    this.y += point.y;

    return this;
};


PIXI.Point.prototype.equals = function(point) {

    return this.x == point.x && this.y == point.y;

};


PIXI.DisplayObjectContainer.prototype.addChildren = function(children)
{
    for(var i = 0; i < children.length; i++) {
        this.addChild(children[i]);
    }
};