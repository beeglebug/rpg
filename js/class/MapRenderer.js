var MapRenderer = function(width, height, data, tileset) {

    this.width = width;
    this.height = height;
    this.data = data;
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
    
    this.tiles = this._generateTiles(this.data);
    
    this.currentTileHighlight = new PIXI.Graphics();
    this.hoverTileHighlight = new PIXI.Graphics();
    this.grid = new PIXI.Graphics();
    
    this.container.addChild(mask);
    this.container.addChild(this.background);
    this.container.addChild(this.tiles);
    this.container.addChild(this.grid);
    this.container.addChild(this.currentTileHighlight);
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
    
    // draw the grid
    this.grid.lineStyle(1, 0xFFFFFF);
    this.grid.alpha = 0.3;

    // vertical lines
    for(var x = 1; x < this.width; x++) {
        this.grid.moveTo(x * this.tileset.tileWidth, 0);
        this.grid.lineTo(x * this.tileset.tileWidth, this.height);
    }

    // horizontal lines
    for(var y = 1; y < this.height; y++) {
        this.grid.moveTo(0, y * this.tileset.tileHeight);
        this.grid.lineTo(this.width, y * this.tileset.tileHeight);
    }

    // current tile highlight
    this.currentTileHighlight.lineStyle(1, 0xFFFFFF);
    this.currentTileHighlight.drawRect(0, 0, this.tileset.tileWidth - 1, this.tileset.tileHeight - 1);
    this.currentTileHighlight.position.set(
        this.center.x,
        this.center.y
    );

    // hover highlight
    this.hoverTileHighlight.lineStyle(1, 0x00FF00);
    this.hoverTileHighlight.drawRect(0, 0, this.tileset.tileWidth - 1, this.tileset.tileHeight - 1);

    // background
    this.background.beginFill(0x666666);
    this.background.drawRect(0, 0, this.width, this.height);
    this.background.endFill();
};


MapRenderer.prototype._generateTiles = function(data) {

    var y, x, tile, texture, sprite, src;
    var self = this;
    var container = new PIXI.DisplayObjectContainer();
    
    for(y = 0; y < data.length; y++) {

        for(x = 0; x < data[y].length; x++) { 

            tile = data[y][x];

            // record the map position
            tile.position = new PIXI.Point(x,y);

            // line of sight data
            //tile.seen = false;
            //tile.canSee = false;

            //temp
            switch(tile.type) {
                case MapTile.TYPE_NULL : 
                    texture = Cache.textures['map-edge'];
                    break;
                case MapTile.TYPE_HOUSE : 
                    texture = Cache.textures['house-s'];
                    break;
                case MapTile.TYPE_ROAD : 
                    texture = Cache.textures['road-h'];
                    break;
            }
            

            // create the tile sprite
            sprite = new PIXI.Sprite(texture);
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

    return this.selectTileAt(x,y);

};

MapRenderer.prototype.selectTileAt = function(x, y) {

    // check bounds
    if(x < 0 || y < 0 || x >= this.data[0].length || y >= this.data.length) { return ;}

    return this.selectTile(this.data[y][x]);
};

MapRenderer.prototype.selectTile = function(tile) {

    // TODO calculate center
    var x = this.center.x - tile.sprite.position.x,
        y = this.center.y - tile.sprite.position.y;

    // TODO player.setTile
    player.position.set(tile.position.x, tile.position.y);
    player.onTile = tile;
    
    //$currentName.text(sprite.tile.name);
    
    this.tiles.position.set(x,y);
    
    //resetLighting();
    
//    calcVisibility(
//        sprite.tile.position.x,
//        sprite.tile.position.y,
//        3
//    );
    
    //renderLighting();

};

MapRenderer.prototype.hover = function(e) {

    var x = Math.floor(e.x / this.tileset.tileWidth) * this.tileset.tileWidth,
        y = Math.floor(e.y / this.tileset.tileHeight) * this.tileset.tileHeight;

    this.hoverTileHighlight.position.set(x,y);
};


MapRenderer.prototype.renderLighting = function() {
       
    var x, y, tile;
    
    for(y = 0; y < this.data.length; y++) {
        
        for(x = 0; x < this.data[y].length; x++) {
            
            tile = this.data[y][x];
            
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