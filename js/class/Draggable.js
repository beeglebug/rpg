var Draggable = function(displayObject) {

    PIXI.DisplayObjectContainer.call(this);

    this.addChild(displayObject);

    this.interactive = true;

    this.mousedown = function(e) {
        DragDropManager.onDragStart(this, e);
    }.bind(this);

    this.mousemove = function(e) {
        DragDropManager.onDragMove(this, e);
    }.bind(this);

    this.mouseup = function(e) {
        DragDropManager.onDrop(this, e);
    }.bind(this);

    this.mouseupoutside = function(e) {
        DragDropManager.onDrop(this, e);
    }.bind(this);

};

Draggable.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);