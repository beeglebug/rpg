function deepProperty(root, key) {

    var keys = key.split('.'),
        node = root;

    for (var i = 0; i < keys.length; i++) {
        key = keys[i];
        if(node[key] == undefined) { return undefined; }
        node = node[key];
    }

    return node;
}