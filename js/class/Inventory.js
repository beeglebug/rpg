var Inventory = function (width, height) {

    this.width = width || 1;
    this.height = height || 1;

    this.items = [];
    this.spatialData = [];

    // create empty grid
    var x, y;
    for (y = 0; y < this.height; y++) {
        this.spatialData[y] = [];
        for (x = 0; x < this.width; x++) {
            this.spatialData[y][x] = null;
        }
    }

    this.packer = new Packer(this.width, this.height);
};

EventEmitter.mixin(Inventory.prototype);

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
            if (this.spatialData[iy][ix] !== null && this.spatialData[iy][ix] !== item) {
                existing = true;
            }
        }
    }

    return !isOutside && !existing;
};


Inventory.prototype.addItemAtPosition = function (item, position) {

    // todo check its not already there
    this.items.push(item);

    item.position.set(position.x, position.y);

    this.setSpatialData(item.position.x, item.position.y, item.width, item.height, item);

    this.emit('item-added', item, this);
};

Inventory.prototype.removeItem = function (item) {

    // todo test it exists first
    this.items.splice( this.items.indexOf(item), 1 );

    this.setSpatialData(item.position.x, item.position.y, item.width, item.height, null);

    this.emit('item-removed', item, this);
};

Inventory.prototype.setSpatialData = function (x, y, width, height, value) {

    var iy, ix;

    for (iy = y; iy < y + height; iy++) {
        for (ix = x; ix < x + width; ix++) {
            this.spatialData[iy][ix] = value;
        }
    }
};

Inventory.prototype.populate = function (items) {

    // convert to packer nodes
    var nodes = items.map(function (item) {
        return {x: 0, y: 0, width: item.width, height: item.height, item: item};
    });

    // try to fit
    this.packer.fit(nodes);

    // apply the results
    nodes.forEach(function (node) {
        if (node.fit) {
            this.addItemAtPosition(node.item, node.fit);
        }
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


