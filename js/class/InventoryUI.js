/**
 * all the ui stuff for displaying and manipulating an inventory
 * @constructor
 */
var InventoryUI = function (inventory, slotWidth, slotHeight) {

    this.inventory = inventory;

    this.slotWidth = slotWidth;
    this.slotHeight = slotHeight;

    var grid = this._generateGrid();

    this.graphics = new Droppable(grid);

    this.index = [];

    this.inventory.items.forEach(function(item){

        this.addItem(item);

    }.bind(this));

    // event listeners
    this.inventory.addEventListener('item-added', function(item) {

        this.addItem(item);

    }.bind(this));

    this.inventory.addEventListener('item-removed', function(item) {

        this.removeItem(item);

    }.bind(this));

};

/**
 * create graphics objects used by the grid
 */
InventoryUI.prototype._generateGrid = function () {

    var grid = new PIXI.Graphics();

    grid.lineStyle(1, 0x888888);

    var x, y, self = this;

    grid.drawRect(0, 0, this.inventory.width * this.slotWidth, this.inventory.height * this.slotHeight);

    // vertical lines
    for (y = 1; y < this.inventory.width; y++) {
        grid.moveTo(y * this.slotHeight, 0);
        grid.lineTo(y * this.slotHeight, this.inventory.height * this.slotHeight);
    }

    // horizontal lines
    for (x = 1; x < this.inventory.height; x++) {
        grid.moveTo(0, x * this.slotWidth);
        grid.lineTo(this.inventory.width * this.slotWidth, x * this.slotWidth);
    }

    return grid;
};


InventoryUI.prototype.addItem = function(item) {

    var gfx = new PIXI.Graphics();

    gfx.beginFill(0xFFFFFF);
    gfx.alpha = 0.8;
    gfx.drawRect(0, 0, item.width * this.slotWidth, item.height * this.slotHeight);

    var draggable = new Draggable(gfx);
    draggable.position.set(item.position.x * this.slotWidth, item.position.y * this.slotHeight);

    this.index[item.id] = draggable;

    this.graphics.addChild(draggable);
};

InventoryUI.prototype.removeItem = function(item) {

    var draggable = this.index[item.id];

    this.graphics.removeChild(draggable);

    delete draggable;

    delete this.index[item.id];
};

//
///**
// * adjust the highlight graphics
// */
//InventoryUI.prototype.resizeHighlight = function (position, item) {
//
//    this.highlight.clear();
//    this.highlight.beginFill(0xFFFFFF);
//
//    var width = item.width * this.slotWidth,
//        height = item.height * this.slotHeight;
//
//    this.highlight.drawRect(0, 0, width, height);
//};
//
///**
// * adjust the highlight graphics
// */
//InventoryUI.prototype.moveHighlight = function (position) {
//
//    this.highlight.position.set(
//        position.x * this.slotWidth,
//        position.y * this.slotHeight
//    );
//};
//
///**
// * adjust the highlight graphics
// */
//InventoryUI.prototype.showHighlight = function () {
//    this.highlight.visible = true;
//};
//
///**
// * adjust the highlight graphics
// */
//InventoryUI.prototype.hideHighlight = function () {
//    this.highlight.visible = false;
//};
//
///**
// * check if a draggable item is over the grid
// * TODO rename isOver
// */
//InventoryUI.prototype.over = function (draggable) {
//
//    var pos = new PIXI.Point(
//        draggable.position.x - this.graphics.position.x + (this.slotWidth / 2),
//        draggable.position.y - this.graphics.position.y + (this.slotHeight / 2)
//    );
//
//    var over = this.graphics.hitArea.contains(pos.x, pos.y);
//
//    if (over) {
//
//        if (this._dragging) {
//            this.dragMove(draggable, pos);
//        } else {
//            this.dragEnter(draggable, pos);
//        }
//
//        return true;
//
//    } else {
//
//        if (this._dragging) {
//            this.dragLeave(draggable, pos);
//        }
//
//        return false;
//    }
//};
//
//
//InventoryUI.prototype.dragEnter = function (draggable, pos) {
//
//    this._dragging = true;
//
//    var slot = this.getGridPositionAt(pos);
//
//    this.resizeHighlight(slot, draggable.gridItem);
//    this.moveHighlight(pos);
//    this.showHighlight(pos);
//
//};
//
//InventoryUI.prototype.dragMove = function (draggable, pos) {
//
//    var slot = this.getGridPositionAt(pos);
//
//    if (this.canDrop(draggable.gridItem, slot)) {
//
//        this.showHighlight();
//
//    } else {
//
//        this.hideHighlight();
//
//    }
//
//    this.moveHighlight(slot);
//};
//
//InventoryUI.prototype.dragLeave = function (draggable, pos) {
//
//    this._dragging = false;
//
//    this.hideHighlight();
//
//    if (!this.spatialConstraint) {
//        draggable.gridItem.grow();
//    }
//};
//
//
///**
// * drop a draggable item on the grid
// */
//InventoryUI.prototype.drop = function (draggable) {
//
//    var pos = new PIXI.Point(
//        draggable.position.x - this.graphics.position.x + (this.slotWidth / 2),
//        draggable.position.y - this.graphics.position.y + (this.slotHeight / 2)
//    );
//
//    var slot = this.getGridPositionAt(pos);
//
//    var item = draggable.gridItem;
//
//    this._dragging = false;
//
//    this.hideHighlight();
//
//    if (this.canDrop(item, slot)) {
//
//        item.grid.remove(item);
//
//        this.add(
//            item,
//            slot.x, slot.y
//        );
//
//        return true;
//    }
//
//    return false;
//};
//
//
///**
// * get the grid position for a point on the graphics
// */
//InventoryUI.prototype.getGridPositionAt = function (position, point) {
//
//    point = point || new PIXI.Point();
//
//    point.x = Math.floor(position.x / this.size);
//    point.y = Math.floor(position.y / this.size);
//
//    return point;
//};
