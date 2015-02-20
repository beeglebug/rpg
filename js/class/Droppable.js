var Droppable = function(displayObject) {

    PIXI.DisplayObjectContainer.call(this);

    this.addChild(displayObject);

    this.interactive = true;

    this.hitArea = displayObject.getBounds();

    DragDropManager.addDropTarget(this);
};

Droppable.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);


Droppable.prototype.onDragOver = function(e, draggable) {



};

/**
 * by default always accepts drops
 */
Droppable.prototype.canAcceptDrop = function(e, draggable) {
    return true;
};