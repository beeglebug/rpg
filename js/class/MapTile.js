var MapTile = function(type)
{ 
    this.type = type;
    this.name = null;
    this.sprite = null;

    this.position = new PIXI.Point();

    this.visibility = 1;
    this.lighting = 0;
};

// type constants
MapTile.TYPE_NULL = 0;
MapTile.TYPE_GRASS = 1;
MapTile.TYPE_ROAD = 2;