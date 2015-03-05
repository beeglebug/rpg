/* jshint node: true */
'use strict';

var Droppable = require('ui/Droppable');
var PIXI = require('pixi');

/**
 * all the ui stuff for displaying and manipulating an inventory
 * @constructor
 * @extends Droppable
 */
var InventoryUI = function (inventory, slotWidth, slotHeight) {

    this.slotWidth = slotWidth;
    this.slotHeight = slotHeight;
    
    this.onAddItem = this.addItem.bind(this);
    this.onMoveItem = this.moveItem.bind(this);
    this.onRemoveItem = this.removeItem.bind(this);

    this.setInventory(inventory);

    var grid = this._generateGrid();

    Droppable.call(this, grid);

    this.index = {};
};

// inheritance
InventoryUI.prototype = Object.create(Droppable.prototype);


InventoryUI.prototype.setInventory = function (inventory) {

    if (this.inventory) {

        // clear old items
        this.inventory.items.forEach(function (item) {
            this.removeItem(item);
        }.bind(this));

        // remove old event listeners
        this.inventory.removeEventListener('item-added', this.onAddItem);
        this.inventory.removeEventListener('item-moved', this.onMoveItem);
        this.inventory.removeEventListener('item-removed', this.onRemoveItem);
    }

    if(inventory) {
        // set new inventory
        this.inventory = inventory;

        // add new items
        this.inventory.items.forEach(function (item) {
            this.addItem(item);
        }.bind(this));

        // add new event listeners
        this.inventory.addEventListener('item-added', this.onAddItem);
        this.inventory.addEventListener('item-moved', this.onMoveItem);
        this.inventory.addEventListener('item-removed', this.onRemoveItem);
    }
};

/**
 * @returns {PIXI.Graphics}
 * @private
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

InventoryUI.prototype.moveItem = function (item) {

    var draggable = this.index[item.id];

    draggable.position.set(item.position.x * this.slotWidth, item.position.y * this.slotHeight);
};

InventoryUI.prototype.addItem = function (item) {

    // already made it
    if(this.index[item.id]) { return; }

    var gfx = new PIXI.Graphics();

    gfx.beginFill(randomColor());
    //gfx.alpha = 0.8;
    gfx.drawRect(0, 0, item.width * this.slotWidth, item.height * this.slotHeight);

    var draggable = new Draggable(gfx);

    draggable.item = item;
    draggable.position.set(item.position.x * this.slotWidth, item.position.y * this.slotHeight);

    this.index[item.id] = draggable;

    this.addChild(draggable);
};

InventoryUI.prototype.removeItem = function (item) {

    var draggable = this.index[item.id];

    this.removeChild(draggable);

    delete this.index[item.id];
};

InventoryUI.prototype.onDragStart = function (e, draggable) {

    this.inventory.removeItem(draggable.item);

};

InventoryUI.prototype.onDragOver = function (e, draggable) {

    // pass the event on to anything listening
    this.emit('drag-over', e, draggable);
};

InventoryUI.prototype.acceptDrop = function (e, draggable) {

    e.getLocalPosition(this, this._temp);

    this.getGridPositionAt(this._temp, this._temp);

    var item = draggable.item;

    // adding the item will add a new graphics
    // so we need to remove the old one first
    draggable.parent.removeChild(draggable);

    this.inventory.addItemAtPosition(item, this._temp);

    // pass the event on to anything listening
    this.emit('drop-accepted', e, draggable);
};

InventoryUI.prototype.canAcceptDrop = function (e, draggable) {

    if (this.accepts && draggable.type !== this.accepts) {
        return false;
    }

    e.getLocalPosition(this, this._temp);

    this.getGridPositionAt(this._temp, this._temp);

    var item = draggable.item;

    return this.inventory.canAddItemAtPosition(item, this._temp);
};

InventoryUI.prototype.getGridPositionAt = function (position, point) {

    point = point || new PIXI.Point();

    point.x = Math.floor(position.x / this.slotWidth);
    point.y = Math.floor(position.y / this.slotHeight);

    return point;
};

module.exports = InventoryUI;