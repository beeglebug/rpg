var UIGrid = function (width, height) {

    this.width = width;
    this.height = height;

    this.size = 12;

    this._dragging = false;

    // should the grid care about the size of items?
    this.spatialConstraint = true;

    // build empty spacial store
    this._spatialStore = [];

    for (var i = 0; i < this.height; i++) {
        this._spatialStore[i] = [];
    }

    this._setSpacialStore(0, 0, this.width, this.height, null)

    this._generateGraphics();
};

/**
 * set values in the spacial store
 */
UIGrid.prototype._setSpacialStore = function (x, y, width, height, value) {

    if (!this.spatialConstraint) {
        return;
    }

    var iy, ix;

    for (iy = y; iy < y + height; iy++) {

        for (ix = x; ix < x + width; ix++) {

            this._spatialStore[iy][ix] = value;
        }
    }
};

/**
 * create graphics objects used by the grid
 */
UIGrid.prototype._generateGraphics = function () {

    var container = new PIXI.DisplayObjectContainer();

    var gfx = new PIXI.Graphics();

    gfx.lineStyle(1, 0x888888);

    var x, y, self = this;

    gfx.drawRect(0, 0, this.width * this.size, this.height * this.size);

    // vertical lines
    for (y = 1; y < this.width; y++) {
        gfx.moveTo(y * this.size, 0);
        gfx.lineTo(y * this.size, this.height * this.size);
    }

    // horizontal lines
    for (x = 1; x < this.height; x++) {
        gfx.moveTo(0, x * this.size);
        gfx.lineTo(this.width * this.size, x * this.size);
    }

    container.addChild(gfx);

    container.interactive = true;
    container.hitArea = new PIXI.Rectangle(0, 0, this.width * this.size, this.height * this.size);

    this.graphics = container;

    // highlight object
    this.highlight = new PIXI.Graphics();

    container.addChild(this.highlight);
};


/**
 * adjust the highlight graphics
 */
UIGrid.prototype.resizeHighlight = function (position, item) {

    this.highlight.clear();
    this.highlight.beginFill(0xFFFFFF, 0.3);

    var width = this.size,
        height = this.size;

    // size matters bro
    if (this.spatialConstraint) {
        width = item.width * this.size;
        height = item.height * this.size;
    }

    this.highlight.drawRect(0, 0, width, height);
};

/**
 * adjust the highlight graphics
 */
UIGrid.prototype.moveHighlight = function (position) {

    this.highlight.position.set(
        position.x * this.size,
        position.y * this.size
    );
};

/**
 * adjust the highlight graphics
 */
UIGrid.prototype.showHighlight = function () {
    this.highlight.visible = true;
};

/**
 * adjust the highlight graphics
 */
UIGrid.prototype.hideHighlight = function () {
    this.highlight.visible = false;
};

/**
 * check if a draggable item is over the grid
 */
UIGrid.prototype.over = function (draggable) {

    var pos = new PIXI.Point(
        draggable.position.x - this.graphics.position.x + (this.size / 2),
        draggable.position.y - this.graphics.position.y + (this.size / 2)
    );

    var over = this.graphics.hitArea.contains(pos.x, pos.y);

    if (over) {

        if (this._dragging) {
            this.dragMove(draggable, pos);
        } else {
            this.dragEnter(draggable, pos);
        }

        return true;

    } else {

        if (this._dragging) {
            this.dragLeave(draggable, pos);
        }

        return false;
    }
};


UIGrid.prototype.dragEnter = function (draggable, pos) {

    this._dragging = true;

    var slot = this.getGridPositionAt(pos);

    this.resizeHighlight(slot, draggable.gridItem);
    this.moveHighlight(pos);
    this.showHighlight(pos);

};

UIGrid.prototype.dragMove = function (draggable, pos) {

    var slot = this.getGridPositionAt(pos);

    if (this.canDrop(draggable.gridItem, slot)) {

        this.showHighlight();

    } else {

        this.hideHighlight();

    }

    this.moveHighlight(slot);
};

UIGrid.prototype.dragLeave = function (draggable, pos) {

    this._dragging = false;

    this.hideHighlight();

    if (!this.spatialConstraint) {
        draggable.gridItem.grow();
    }
};


/**
 * drop a draggable item on the grid
 */
UIGrid.prototype.drop = function (draggable) {

    var pos = new PIXI.Point(
        draggable.position.x - this.graphics.position.x + (this.size / 2),
        draggable.position.y - this.graphics.position.y + (this.size / 2)
    );

    var slot = this.getGridPositionAt(pos);

    var item = draggable.gridItem;

    this._dragging = false;

    this.hideHighlight();

    if (this.canDrop(item, slot)) {

        item.grid.remove(item);

        this.add(
            item,
            slot.x, slot.y
        );
        if (!this.spatialConstraint) {
            item.shrink();
        }

        return true;
    }

    return false;
};


/**
 * get the grid position for a point on the graphics
 */
UIGrid.prototype.getGridPositionAt = function (position, point) {

    point = point || new PIXI.Point();

    point.x = Math.floor(position.x / this.size);
    point.y = Math.floor(position.y / this.size);

    return point;
};


/**
 * check if a griditem can fit at a particular point
 */
UIGrid.prototype.canDrop = function (item, position) {

    var iy, ix, existing = false,
        maxX = position.x + item.width,
        maxY = position.y + item.height;

    var outside = (
    maxX > this.width ||
    maxY > this.height
    );

    if (maxX > this.width) {
        maxX = this.width;
    }
    if (maxY > this.height) {
        maxY = this.height;
    }

    for (iy = position.y; iy < maxY; iy++) {

        for (ix = position.x; ix < maxX; ix++) {

            if (this._spatialStore[iy][ix] !== null && this._spatialStore[iy][ix] !== item) {
                existing = true;
            }
        }
    }

    // return depends on constraints
    if (!this.spatialConstraint) {
        return !existing;
    } else {
        return !outside && !existing;
    }
};


/**
 * add a griditem to the grid (such as when dropped)
 */
UIGrid.prototype.add = function (item, x, y) {

    item.position.set(x, y);

    this.graphics.addChild(item.sprite);

    item.sprite.position.set(x * this.size, y * this.size);

    item.grid = this;

    // add to store
    this._setSpacialStore(item.position.x, item.position.y, item.width, item.height, item);
};


/**
 * remove an item from the grid
 */
UIGrid.prototype.remove = function (item) {

    item.grid = null;

    // remove from store
    this._setSpacialStore(item.position.x, item.position.y, item.width, item.height, null);
};


UIGrid.prototype.populate = function (items) {

    // todo add reset function to packer and create this in constructor
    var packer = new Packer(this.width, this.height);

    // convert to packer nodes
    var nodes = items.map(function (item) {
        return {x: 0, y: 0, width: item.width, height: item.height, item: item};
    });

    // try to fit
    packer.fit(nodes);

    // apply the results
    nodes.forEach(function (node) {

        if (node.fit) {
            this.add(node.item, node.fit.x, node.fit.y);
        }

    }.bind(this));

};