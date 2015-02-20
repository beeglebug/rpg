var DragDropManager = {};

DragDropManager.init = function(root) {

    this.dragging = null;

    this.start = new PIXI.Point();
    this.offset = new PIXI.Point();
    this.origin = new PIXI.Point();

    this.dropTargets = [];
    this.currentDropTarget = null;

    this.root = root;

    this.root.mousemove = function(e) {
        this.onDragMove(e);
    }.bind(this);
};

DragDropManager.addDropTarget = function(target) {

    this.dropTargets.push(target);

};

DragDropManager.onDragStart = function(e, draggable) {

    if(this.dragging) { return; }

    this.dragging = draggable;
    
    var pos = e.getLocalPosition(draggable);

    this.offset.set(pos.x, pos.y);

    this.start.set(e.global.x, e.global.y);

    // remember where it came from
    this.origin.set(
        draggable.position.x,
        draggable.position.y
    );
};


DragDropManager.onDragMove = function(e) {

    if(!this.dragging) { return; }

    // how far has the mouse moved?
    var dx = e.global.x - this.start.x,
        dy = e.global.y - this.start.y;

    this.dragging.position.set(
        this.origin.x + dx,
        this.origin.y + dy
    );

    this.currentDropTarget = null;

    // go through all possible drop targets and see if we are over any
    for(var i = 0; i < this.dropTargets.length; i++) {

        if(this.root.stage.interactionManager.hitTest(this.dropTargets[i], e)) {
            this.currentDropTarget = this.dropTargets[i];
            this.currentDropTarget.onDragOver(e, this.dragging);
            break;
        }

    }
};

DragDropManager.onDrop = function(e, draggable) {

    if(!this.dragging) { return; }

    var dropped = false;

    if(this.currentDropTarget) {
        // try to drop it on the target
        if(this.currentDropTarget.canAcceptDrop(e, draggable)) {
            dropped = true;
        }
    }

    // either not over a target at all
    // or unsuccessful for other reasons
    if(!dropped) {
        this.revert();
    }

    this.dragging = null;
};

/**
 * put the draggable back where it came from
 */
DragDropManager.revert = function() {

    this.dragging.position.set(
        this.origin.x,
        this.origin.y
    );
};