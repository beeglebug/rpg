var Droppable = function(displayObject) {

    PIXI.DisplayObjectContainer.call(this);

    this.addChild(displayObject);

    this.interactive = true;

    DragDropManager.addDropTarget(this);
};

Droppable.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);