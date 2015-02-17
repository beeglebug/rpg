var DragDropManager = {};

DragDropManager.init = function() {

    this.dragging = null;

    this.start = new PIXI.Point();
    this.offset = new PIXI.Point();
    this.origin = new PIXI.Point();

    this.dropTargets = [];
};


DragDropManager.onDragStart = function(draggable, e) {

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


DragDropManager.onDragMove = function(draggable, e) {

    if(!this.dragging || this.dragging !== draggable) { return; }

    // how far has the mouse moved?
    var dx = e.global.x - this.start.x,
        dy = e.global.y - this.start.y;

    this.dragging.position.set(
        this.origin.x + dx,
        this.origin.y + dy
    );

    // go through all possible drop targets
    for(var i = 0; i < this.dropTargets.length; i++) {
        if(this.dropTargets[i].over(this.dragging)) {
            this.over = this.dropTargets[i];
            break;
        }
    }
};

DragDropManager.onDrop = function(draggable, e) {

    if(!this.dragging) { return; }

    var dropped = false;

    if(this.over) {
        // try to drop it on the target
        dropped = this.over.drop(this.dragging);
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