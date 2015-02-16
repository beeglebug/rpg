var Inventory = function (width, height) {

    this.width = width;
    this.height = height;

    this.data = [];

    // create empty grid
    var x, y;
    for (y = 0; y < this.height; y++) {
        this.data[y] = [];
        for (x = 0; x < this.width; x++) {
            this.data[y][x] = null;
        }
    }

    this.packer = new Packer(this.width, this.height);
};

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
            if (this.data[iy][ix] !== null && this.data[iy][ix] !== item) {
                existing = true;
            }
        }
    }

    return !isOutside && !existing;
};


Inventory.prototype.addItemAtPosition = function (item, position) {

    item.position.set(position.x, position.y);

    this.setData(item.position.x, item.position.y, item.width, item.height, item);
};

Inventory.prototype.removeItem = function (item) {

    // remove from store
    this.setData(item.position.x, item.position.y, item.width, item.height, null);
};

Inventory.prototype.setData = function (x, y, width, height, value) {

    var iy, ix;

    for (iy = y; iy < y + height; iy++) {
        for (ix = x; ix < x + width; ix++) {
            this.data[iy][ix] = value;
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


