var MapRenderer = function(width, height, map, tileset) {

    this.width = width;
    this.height = height;
    this.map = map;
    this.tileset = tileset;

    this.center = new PIXI.Point(
        this.width / 2,
        this.height / 2
    );

    this.container = new PIXI.DisplayObjectContainer();
    this.container.interactive = true;
    this.container.hitArea = new PIXI.Rectangle(0, 0, this.width, this.height);
    
    var mask = new PIXI.Graphics();
    mask.beginFill();
    mask.drawRect(0, 0, this.width, this.height);
    mask.endFill();
    
    this.container.mask = mask;
    
    // create the structure
    this.background = new PIXI.Graphics();
    
    this.tiles = this._generateTiles();
    
    this.hoverTileHighlight = new PIXI.Graphics();
    this.grid = new PIXI.Graphics();
    
    this.container.addChild(mask);
    this.container.addChild(this.background);
    this.container.addChild(this.tiles);
    this.container.addChild(this.grid);
    this.container.addChild(this.hoverTileHighlight);
    
    var self = this;
    
    // mouse events
    this.container.mousemove = function(e) {
        if(!e.target) { return; }
        var hit = e.target.stage.interactionManager.hitTest(this,e);
        if(hit) {
            self.hover(e.getLocalPosition(this));
        }
    };
    
    this.container.mouseover = function(e) {
        self.mouseover(e.getLocalPosition(this));
    };
    
    this.container.mouseout = function(e) {
        self.mouseout(e.getLocalPosition(this));
    };

    this.container.click = function(e) {
        self.click(e.getLocalPosition(this));
    };

    // draw stuff
    this._drawGraphics();
};


MapRenderer.prototype._drawGraphics = function() {
    
    //draw the grid
    this.grid.lineStyle(1, 0xFFFFFF);
    this.grid.alpha = 0.1;

    var width = Math.ceil(this.width / this.tileset.tileWidth) + 1;
    var height = Math.ceil(this.height / this.tileset.tileHeight) + 1;

    // vertical lines
    for(var x = 0; x < width; x++) {
        this.grid.moveTo(x * this.tileset.tileWidth, 0);
        this.grid.lineTo(x * this.tileset.tileWidth, height * this.tileset.tileHeight);
    }

    // horizontal lines
    for(var y = 0; y < height; y++) {
        this.grid.moveTo(0, y * this.tileset.tileHeight);
        this.grid.lineTo(width * this.tileset.tileWidth, y * this.tileset.tileHeight);
    }

    // TODO calculate
    this.grid.position.set(
        -8,
        -26
    );

    // hover highlight
    this.hoverTileHighlight.lineStyle(1, 0x00FF00);
    this.hoverTileHighlight.drawRect(0, 0, this.tileset.tileWidth - 1, this.tileset.tileHeight - 1);

    // background
    this.background.beginFill(0x222222);
    this.background.drawRect(0, 0, this.width, this.height);
    this.background.endFill();
};


MapRenderer.prototype._generateTiles = function() {

    var y, x, tile, texture, sprite, src;
    var self = this;
    var container = new PIXI.DisplayObjectContainer();
    
    for(y = 0; y < this.map.data.length; y++) {

        for(x = 0; x < this.map.data[y].length; x++) {

            tile = this.map.data[y][x];

            // record the local (map) position
            tile.position.set(x,y);

            //temp
            switch(tile.type) {
                case MapTile.TYPE_NULL : 
                    texture = 'img/map-edge.png';
                    break;
                case MapTile.TYPE_GRASS :
                    texture = 'img/grass.png';
                    break;
                case MapTile.TYPE_ROAD : 
                    texture = 'img/road.png';
                    break;
            }
            

            // create the tile sprite
            sprite = new PIXI.Sprite.fromImage(texture);
            sprite.position.set(x * this.tileset.tileWidth, y * this.tileset.tileHeight);

            // link the sprite and the tile for easy access later
            sprite.tile = tile;
            tile.sprite = sprite;

            // add an overlay for lighting
            var lighting = new PIXI.Graphics();
            lighting.beginFill(0x000000);
            lighting.drawRect(0,0,64,64);
            
            //sprite.addChild(lighting);

            tile.lightingSprite = lighting;

            container.addChild(sprite);
        }
    }
    
    container.interactive = true;

    return container;
};

MapRenderer.prototype.click = function(position) {

    var x = Math.floor((position.x - this.tiles.position.x) / this.tileset.tileWidth);
    var y = Math.floor((position.y - this.tiles.position.y) / this.tileset.tileHeight);

    var tile = this.map.getTileAt(x,y);

    if(!tile) { return; }

    return this.selectTile(tile);

};



MapRenderer.prototype.selectTile = function(tile) {

    // TODO player.setTile
    player.position.set(tile.position.x, tile.position.y);
    player.onTile = tile;
    
    //$currentName.text(sprite.tile.name);
    
    this.centerTile(tile);

    //resetLighting();
    
//    calcVisibility(
//        sprite.tile.position.x,
//        sprite.tile.position.y,
//        3
//    );
    
    //renderLighting();

};

MapRenderer.prototype.hover = function(position) {

    var mapX = Math.floor((position.x - this.tiles.position.x) / this.tileset.tileWidth );
    var mapY = Math.floor((position.y - this.tiles.position.y) / this.tileset.tileHeight );

    var tile = this.map.getTileAt(mapX,mapY);

    var show = true;

    if(!tile) { show = false; }

    if(show) {
        this.hoverTileHighlight.visible = true;
    } else {
        this.hoverTileHighlight.visible = false;
    }

    var x = (mapX * this.tileset.tileWidth) + this.tiles.position.x,
        y = (mapY * this.tileset.tileHeight) + this.tiles.position.y;

    this.hoverTileHighlight.position.set(x,y);
};


MapRenderer.prototype.renderLighting = function() {
       
    var x, y, tile;
    
    for(y = 0; y < this.map.length; y++) {
        
        for(x = 0; x < this.map[y].length; x++) {
            
            tile = this.map[y][x];
            
            if (tile.canSee) {
                tile.lightingSprite.alpha = 0;
            } else if (tile.seen) {
                tile.lightingSprite.alpha = 0.7;
            } else {
                tile.lightingSprite.alpha = 1;
            }
        }
    }   

};

MapRenderer.prototype.mouseover = function(e) {
    this.hoverTileHighlight.visible = true;
};

MapRenderer.prototype.mouseout = function(e) {
    this.hoverTileHighlight.visible = false;
};

MapRenderer.prototype.centerTile = function(tile) {

    var tileCenter = new PIXI.Point(
        (tile.position.x * this.tileset.tileWidth) + (this.tileset.tileWidth / 2),
        (tile.position.y * this.tileset.tileHeight) + (this.tileset.tileHeight / 2)
    );

    this.tiles.position.set(
        this.center.x - tileCenter.x,
        this.center.y - tileCenter.y
    );


};