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

    this.offset.set(pos.x, pos.y);
    
    this.origin.position.set(
        sprite.position.x,
        sprite.position.y
    );
    
    this.origin.parent = sprite.parent;
};

DragDrop.move = function(sprite, e) {

    var pos = e.getLocalPosition(sprite);
    
    if(this.dragging) {

        this.dragging.position.set(
            pos.x - this.offset.x,
            pos.y - this.offset.y
        );
        
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
        
    }
    
    // debug
    Debug.setMousePos(pos);
};

DragDrop.stop = function(sprite, e) {

    if(this.dragging) {
        
        var dropped = false;
        
        if(this.over) {
            
            // drop it on target        
            dropped = this.over.drop(this.dragging);
        
        }
        
        if(!dropped) {
            
            // put it back where it came from
            this.origin.parent.addChild(this.dragging);

            this.dragging.position.set(
                this.origin.position.x,
                this.origin.position.y
            );
        }
        
        this.dragging = null;
    }

};

DragDrop.registerDropTarget = function(target) {
  this.dropTargets.push(target);
};