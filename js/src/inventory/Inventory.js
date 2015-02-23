var Inventory = function (width, height) {

    this.width = width || 1;
    this.height = height || 1;

    this.items = [];

    // create empty grid
    this.spatialIndex = array2d(this.width, this.height, null);
};

EventEmitterMixin.call(Inventory.prototype);

Inventory.prototype.canAddItemAtPosition = function (item, position) {

    // quick exit, already occupied
    if (this.spatialIndex[position.y][position.x] !== null) {
        return false;
    }

    var maxX = position.x + item.width,
        maxY = position.y + item.height;

    // quick exit, outside bounds
    if (maxX > this.width || maxY > this.height) {
        return;
    }

    var y, x;

    for (y = position.y; y < maxY; y++) {
        for (x = position.x; x < maxX; x++) {
            if (this.spatialIndex[y][x] !== null && this.spatialIndex[y][x] !== item) {
                // quick exit, something here
                return false;
            }
        }
    }

    // not outside, not occupied
    return true;
};

Inventory.prototype.containsItem = function (item) {

    var x, y;

    for (y = 0; y < this.height; y++) {
        for (x = 0; x < this.width; x++) {
            if (this.spatialIndex[y][x] == item) {
                return true;
            }
        }
    }

    return false;
};

/**
 * @param item
 * @param position
 * @fires item-moved
 * @fires item-added
 */
Inventory.prototype.addItemAtPosition = function (item, position) {

    var ix = this.items.indexOf(item);

    // already exists, just move it
    if (ix >= 0) {

        // clear spatial data
        this.setSpatialIndex(item.position.x, item.position.y, item.width, item.height, null);

        item.position.set(position.x, position.y);

        // set again
        this.setSpatialIndex(item.position.x, item.position.y, item.width, item.height, item);

        this.emit('item-moved', item, this);

    } else {

        this.items.push(item);

        item.position.set(position.x, position.y);

        this.setSpatialIndex(item.position.x, item.position.y, item.width, item.height, item);

        this.emit('item-added', item, this);
    }

    return true;
};

Inventory.prototype.removeItem = function (item) {

    var ix = this.items.indexOf(item);

    // doesn't exist
    if (ix < 0) {
        return;
    }

    this.items.splice(ix, 1);

    this.setSpatialIndex(item.position.x, item.position.y, item.width, item.height, null);

    this.emit('item-removed', item, this);
};

Inventory.prototype.setSpatialIndex = function (x, y, width, height, value) {

    var iy, ix;

    for (iy = y; iy < y + height; iy++) {
        for (ix = x; ix < x + width; ix++) {
            this.spatialIndex[iy][ix] = value;
        }
    }
};

Inventory.prototype.addItem = function (item) {

    var pos = this.findAvailableSlot(item);

    if (pos) {
        return this.addItemAtPosition(item, pos);
    }

    return false;
};

Inventory.prototype.findAvailableSlot = function (item) {

    var slot = new PIXI.Point();

    var x, y,
        maxX = this.width - item.width,
        maxY = this.height - item.height;

    for (y = 0; y <= maxY; y++) {
        for (x = 0; x <= maxX; x++) {
            slot.set(x, y);
            if (this.canAddItemAtPosition(item, slot)) {
                return slot;
            }
        }
    }

    return false;
};

Inventory.prototype.clear = function () {

    if (!this.items.length) {
        return;
    }

    // clear items
    for (var i = this.items.length - 1; i >= 0; i--) {
        this.removeItem(this.items[i]);
    }
    ;

    // reset packer
    this.packer.reset(this.width, this.height);
};


