/**
 * all the ui stuff for displaying and manipulating an inventory
 * @constructor
 * @extends Droppable
 * @mixes EventEmitterMixin
 */
var InventoryGrid = function (inventory, slotWidth, slotHeight) {

    this.inventory = inventory;
    this.slotWidth = slotWidth;
    this.slotHeight = slotHeight;

    var grid = this._generateGrid();

    Droppable.call(this, grid);

    this.index = [];

    this.inventory.items.forEach(function (item) {

        this.addItem(item);

    }.bind(this));

    // event listeners
    this.inventory.addEventListener('item-added', this.addItem.bind(this));
    this.inventory.addEventListener('item-moved', this.moveItem.bind(this));
    this.inventory.addEventListener('item-removed', this.removeItem.bind(this));

};

InventoryGrid.prototype = Object.create(Droppable.prototype);


InventoryGrid.prototype._generateGrid = function () {

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

InventoryGrid.prototype.moveItem = function (item) {

    var draggable = this.index[item.id];

    draggable.position.set(item.position.x * this.slotWidth, item.position.y * this.slotHeight);
};

InventoryGrid.prototype.addItem = function (item) {

    var gfx = new PIXI.Graphics();

    gfx.beginFill(0xFFFFFF);
    gfx.alpha = 0.8;
    gfx.drawRect(0, 0, item.width * this.slotWidth, item.height * this.slotHeight);

    var draggable = new Draggable(gfx);

    this.index[item.id] = draggable;
    draggable.item = item;

    draggable.position.set(item.position.x * this.slotWidth, item.position.y * this.slotHeight);

    this.addChild(draggable);
};

InventoryGrid.prototype.removeItem = function (item) {

    var draggable = this.index[item.id];

    this.removeChild(draggable);

    delete draggable;

    delete this.index[item.id];
};

InventoryGrid.prototype.onDragOver = function (e, draggable) {

    // pass the event on to anything listening
    this.emit('drag-over', e, draggable);
};

InventoryGrid.prototype.acceptDrop = function (e, draggable) {

    e.getLocalPosition(this, this._temp);

    this.getGridPositionAt(this._temp, this._temp);

    var item = draggable.item;

    // does it need moving from a different parent?
    if(draggable.parent !== this) {

        // kill the old one
        draggable.parent.inventory.removeItem(item);
    }

    this.inventory.addItemAtPosition(item, this._temp);

    // pass the event on to anything listening
    this.emit('drop-accepted', e, draggable);
};

InventoryGrid.prototype.canAcceptDrop = function (e, draggable) {

    if (this.accepts && draggable.type !== this.accepts) {
        return false;
    }

    e.getLocalPosition(this, this._temp);

    this.getGridPositionAt(this._temp, this._temp);

    var item = draggable.item;

    return this.inventory.canAddItemAtPosition(item, this._temp);
};

InventoryGrid.prototype.getGridPositionAt = function (position, point) {

    point = point || new PIXI.Point();

    point.x = Math.floor(position.x / this.slotWidth);
    point.y = Math.floor(position.y / this.slotHeight);

    return point;
};