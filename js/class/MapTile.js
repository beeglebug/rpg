var MapTile = function(type)
{ 
    this.type = type;
    this.name = null;
    this.sprite = null;

    this.position = new PIXI.Point();

    this.visibility = MapTile.VISIBILITY_NONE;
    this.solid = false;
};

// TODO don't use types, use attributes
MapTile.TYPE_NULL = 0;
MapTile.TYPE_GRASS = 1;
MapTile.TYPE_ROAD = 2;
MapTile.TYPE_BUILDING = 3;

MapTile.VISIBILITY_NONE = 0;
MapTile.VISIBILITY_PREVIOUS = 1;
MapTile.VISIBILITY_VISIBLE = 2;