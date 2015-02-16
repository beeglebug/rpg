var DragDrop = {};

DragDrop.init = function(root) {
  
    this.dragging = null;
    this.offset = new PIXI.Point();

    this.root = root;
    this.root.interactive = true;

    this.origin = {
        position : new PIXI.Point(),
        parent : null
    };
    
    this.over = null;

    this.dropTargets = [];

    var self = this;
    this.root.mousemove = function(e) { self.move(this, e); };
    this.root.mouseup = function(e) { self.stop(this, e); };
    
};

DragDrop.enable = function(item) {
    
    var self = this;

    item.interactive = true;
    item.mousedown = function(e) { self.start(this, e); }
};

DragDrop.start = function(sprite, e) {

    this.dragging = sprite;
    
    var pos = e.getLocalPosition(sprite);

    //todo rename to dragStart
    this.offset.set(pos.x, pos.y);

    // remember where it came from
    this.origin.position.set(
        sprite.position.x,
        sprite.position.y
    );
    
    this.origin.parent = sprite.parent;
};

DragDrop.move = function(sprite, e) {

    if(!this.dragging) { return; }

    var pos = e.getLocalPosition(sprite);

    this.dragging.position.set(
        pos.x - this.offset.x,
        pos.y - this.offset.y
    );

    // todo move to start
    // move out to global scope
    this.root.addChild(this.dragging);

    this.over = null;

    // go through all possible drop targets
    for(var i = 0; i < this.dropTargets.length; i++) {
        if(this.dropTargets[i].over(this.dragging)) {
            this.over = this.dropTargets[i];
            break;
        }
    }
};

DragDrop.stop = function(sprite, e) {

    if(!this.dragging) { return; }
        
    var dropSuccess = false;

    if(this.over) {
        // try to drop it on the target
        dropSuccess = this.over.drop(this.dragging);
    }

    // either not over a target at all
    // or unsuccessful for other reasons
    if(!dropSuccess) {
        this.revert();
    }

    this.dragging = null;

};

/**
 * put the current draggable back where it came from
 */
DragDrop.revert = function() {

    this.origin.parent.addChild(this.dragging);

    this.dragging.position.set(
        this.origin.position.x,
        this.origin.position.y
    );

};

/**
 * must have a drop method
 */
DragDrop.registerDropTarget = function(target) {
    this.dropTargets.push(target);
};