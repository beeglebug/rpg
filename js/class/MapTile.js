var MapTile = function (type, x, y) {

    this.type = type;
    this.position = new PIXI.Point(x, y);

    this.entities = [];

    this.name = null;
    this.sprite = null;

    this.visibility = MapTile.VISIBILITY_NONE;
    this.solid = false;
};

MapTile.VISIBILITY_NONE = 0;
MapTile.VISIBILITY_PREVIOUS = 1;
MapTile.VISIBILITY_VISIBLE = 2;