var Inventory = function (width, height) {

    this.width = width || 1;
    this.height = height || 1;

    this.items = [];

    // create empty grid
    this.spatialIndex = array2d(this.width, this.height, null);

    // todo make singleton packer
    this.packer = new Packer(this.width, this.height);
};

EventEmitterMixin.call(Inventory.prototype);

Inventory.prototype.canAddItemAtPosition = function (item, position) {

    var iy, ix, existing = false,
        maxX = position.x + item.width,
        maxY = position.y + item.height;

    var isOutside = (
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
            if (this.spatialIndex[iy][ix] !== null && this.spatialIndex[iy][ix] !== item) {
                existing = true;
            }
        }
    }

    return !isOutside && !existing;
};

Inventory.prototype.containsItem = function(item) {

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
    if(ix >= 0) {

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
};

Inventory.prototype.removeItem = function (item) {

    var ix = this.items.indexOf(item);

    // doesn't exist
    if(ix < 0) { return; }

    this.items.splice( ix, 1 );

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

Inventory.prototype.packAndFill = function (items) {

    // convert to packer nodes
    var nodes = items.map(function (item) {
        return {x: 0, y: 0, width: item.width, height: item.height, item: item};
    });

    // try to fit
    this.packer.fit(nodes);

    // copy the positions down to items
    nodes.forEach(function (node) {
        if (node.fit) {
            node.item.position.set(node.fit.x, node.fit.y);
        }
    }.bind(this));

    this.fill(nodes);
};

Inventory.prototype.addItem = function(item) {

    // todo find next available slot
    var pos = new PIXI.Point();

    this.addItemAtPosition(item, pos);
};

Inventory.prototype.fill = function(items) {

    this.clear();

    items.forEach(function (item) {

        this.addItemAtPosition(item, item.position);

    }.bind(this));
};

Inventory.prototype.clear = function() {

    if(!this.items.length) { return; }

    // clear items
    for(var i = this.items.length - 1; i >= 0; i--) {
        this.removeItem(this.items[i]);
    };

    // reset packer
    this.packer.reset(this.width, this.height);
};


