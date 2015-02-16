/**
 * all the ui stuff for displaying and manipulating an inventory
 * @param width
 * @param height
 * @constructor
 */

var UIGrid = function (width, height) {

    this.width = width;
    this.height = height;

    this.size = 12;

    this._dragging = false;

    this._generateGraphics();
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
    this.highlight.alpha = 0.3;

    container.addChild(this.highlight);
};


/**
 * adjust the highlight graphics
 */
UIGrid.prototype.resizeHighlight = function (position, item) {

    this.highlight.clear();
    this.highlight.beginFill(0xFFFFFF);

    var width = item.width * this.size,
        height = item.height * this.size;

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
 * TODO rename isOver
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
