/**
 * @class
 * @name DragDropManager
 */
var DragDropManager = {};

DragDropManager.init = function (root) {

    this.dragging = null;

    this.start = new PIXI.Point();
    this.offset = new PIXI.Point();

    this.origin = {
        position : new PIXI.Point(),
        parent : null
    };

    this.dropTargets = [];
    this.currentDropTarget = null;

    this.root = root;

    this.root.mousemove = function (e) {
        this.onDragMove(e);
    }.bind(this);
};

DragDropManager.addDropTarget = function (target) {

    this.dropTargets.push(target);

};

DragDropManager.onDragStart = function (e, draggable) {

    // already dragging (shouldn't be possible)
    if (this.dragging) {
        return;
    }

    this.dragging = draggable;

    // record mouse position inside element
    e.getLocalPosition(draggable, this.offset);

    // record position within root element
    e.getLocalPosition(this.root, this.start);

    // remember where it came from
    this.origin.position.set(
        draggable.position.x,
        draggable.position.y
    );

    this.origin.parent = draggable.parent;

    draggable.parent.onDragStart(e, draggable);

    // move to root so as to be above other ui elements
    this.root.addChild(draggable);

    // set starting position
    draggable.position.set(
        this.start.x - this.offset.x,
        this.start.y - this.offset.y
    );
};


DragDropManager.onDragMove = function (e) {

    if (!this.dragging) {
        return;
    }

    var pos = e.getLocalPosition(this.root);

    this.dragging.position.set(
        pos.x - this.offset.x,
        pos.y - this.offset.y
    );

    this.currentDropTarget = null;

    // go through all possible drop targets and see if we are over any
    for (var i = 0; i < this.dropTargets.length; i++) {

        if (this.root.stage.interactionManager.hitTest(this.dropTargets[i], e)) {
            this.currentDropTarget = this.dropTargets[i];
            this.currentDropTarget.onDragOver(e, this.dragging);
            break;
        }

    }
};

DragDropManager.onDrop = function (e, draggable) {

    if (!this.dragging) {
        return;
    }
    if (this.currentDropTarget && this.currentDropTarget.canAcceptDrop(e, this.dragging)) {

        // do the drop
        this.currentDropTarget.acceptDrop(e, this.dragging);

    } else {

        // revert to where it came from
        this.dragging.position.set(
            this.origin.position.x,
            this.origin.position.y
        );

        this.origin.parent.addChild(this.dragging);
    }

    this.dragging = null;
};
