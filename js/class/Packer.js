/**
 * based on https://github.com/jakesgordon/bin-packing
 */
var Packer = function (width, height) {

    this.heuristic = this.heuristics.sortByMaxSide;

    this.root = {
        x: 0,
        y: 0,
        width: width,
        height: height
    };

};

Packer.prototype.fit = function (blocks) {

    // pre-sort for optimum result
    blocks.sort(this.heuristic);

    var i, len, node, block;

    for (i = 0, len = blocks.length; i < len; i++) {

        block = blocks[i];

        node = this.findNode(this.root, block.width, block.height);

        if (node) {
            block.fit = this.splitNode(node, block.width, block.height);
        }
    }
};

/**
 * find a node that it can fit in
 */
Packer.prototype.findNode = function (root, width, height) {

    var node = null;

    if (root.used) {

        // look right
        node = this.findNode(root.right, width, height);

        if (!node) {
            // look down
            node = this.findNode(root.down, width, height);
        }

        return node;

    } else if ((width <= root.width) && (height <= root.height)) {

        return root;

    } else {

        return null;

    }
};

/**
 * split a node (creates new nodes representing the rect below and right of it)
 */
Packer.prototype.splitNode = function (node, width, height) {

    node.used = true;

    node.down = {
        x: node.x,
        y: node.y + height,
        width: node.width,
        height: node.height - height
    };

    node.right = {
        x: node.x + width,
        y: node.y,
        width: node.width - width,
        height: height
    };

    return node;
};

/**
 * pre-sort functions
 */
Packer.prototype.heuristics = {
    sortByHeight: function (a, b) {
        return b.height > a.height;
    },
    sortByMaxSide: function (a, b) {
        return Math.max(b.width, b.height) - Math.max(a.width, a.height);
    }
};