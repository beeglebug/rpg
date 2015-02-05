var stage = new PIXI.Stage(0xDDDDDD, true);
var renderer = PIXI.autoDetectRenderer(800, 600);

// init singletons
DragDrop.init(stage);
Debug.init(stage);

// add to dom
//$('.canvas').append(renderer.view);

var player = {
    position : new PIXI.Point(),
    onTile : null
};

// map
var mapData = generateMap(15, 15);
var tileset = new TileSet(32, 32);
var map = new MapRenderer(256, 256, mapData, tileset);
stage.addChild(map.container);
map.container.position.set(10, 10);

// uigrid testing
var grid1 = new UIGrid(4,4);
grid1.graphics.position.set(500,100);
stage.addChild(grid1.graphics);

var grid2 = new UIGrid(3,6);
grid2.graphics.position.set(500,300);
stage.addChild(grid2.graphics);

var grid3 = new UIGrid(1,1);
grid3.spatialConstraint = false;
grid3.graphics.position.set(500,500);
stage.addChild(grid3.graphics);


item1 = new UIGridItem(TextureCache['items/1x1'], 1, 1, TextureCache['items/1x1']);
item2 = new UIGridItem(TextureCache['items/2x1'], 2, 1, TextureCache['items/1x1']);
item3 = new UIGridItem(TextureCache['items/2x3'], 2, 3, TextureCache['items/1x1']);
item4 = new UIGridItem(TextureCache['items/1x2'], 1, 2, TextureCache['items/1x1']);

grid1.populate([item1, item2, item3, item4]);

// add to stage last so its on top
stage.addChild(Debug.container);

/**
 * main loop
 */
function animate() {
    requestAnimFrame( animate );
    renderer.render(stage);
}

requestAnimFrame( animate );





