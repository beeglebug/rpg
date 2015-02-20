var Draggable = function(displayObject) {

    PIXI.DisplayObjectContainer.call(this);

    this.addChild(displayObject);

    this.interactive = true;

    this.mousedown = function(e) {
        DragDropManager.onDragStart(e, this);
    }.bind(this);

    this.mouseup = function(e) {
        DragDropManager.onDrop(e, this);
    }.bind(this);

    this.mouseupoutside = function(e) {
        DragDropManager.onDrop(e, this);
    }.bind(this);

};

Draggable.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);