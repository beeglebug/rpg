PIXI.Point.prototype.add = function(point) {

    this.x += point.x;
    this.y += point.y;

    return this;
};


PIXI.Point.prototype.equals = function(point) {

    return this.x == point.x && this.y == point.y;

};