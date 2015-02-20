/**
 * A display object which can accept draggables
 * @param displayObject
 * @param accepts
 * @constructor
 * @extends PIXI.DisplayObjectContainer
 * @mixes EventEmitter
 */
var Droppable = function(displayObject, accepts) {

    PIXI.DisplayObjectContainer.call(this);

    this.interactive = true;

    this.addChild(displayObject);

    this.accepts = accepts || null;

    this.hitArea = displayObject.getBounds();

    // register self with manager
    DragDropManager.addDropTarget(this);
};

Droppable.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);

EventEmitterMixin.call(Droppable.prototype);


// default drop check always passes
Droppable.prototype.dropCheck = function(e, draggable) { return true; };

// does nothing by default
Droppable.prototype.onDragOver = function(e, draggable) { };

/**
 * check if this droppable can accept the draggable
 * checks the type if needed, and then calls the dropCheck function
 * which can be set externally by controlling classes
 */
Droppable.prototype.canAcceptDrop = function(e, draggable) {

    if(this.accepts && draggable.type !== this.accepts) { return false; }

    return this.dropCheck(e, draggable);
};