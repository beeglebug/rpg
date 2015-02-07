var stage = new PIXI.Stage(0xDDDDDD, true);
var renderer = PIXI.autoDetectRenderer(800, 600);

// init singletons
DragDrop.init(stage);
Debug.init(stage);

Preloader.loadTextures([
    'map-edge',
    'house-n',
    'house-s',
    'road-h',
    'road-v',
    'road-t-s',
    'garden-n',
    'garden-s',
    'items/1x1',
    'items/2x1',
    'items/1x2',
    'items/1x4',
    'items/2x2',
    'items/2x3'
]);

// add to dom
document.getElementById('canvas-wrapper').appendChild(renderer.view);

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
var grid1 = new UIGrid(6,6);
grid1.graphics.position.set(500,100);
stage.addChild(grid1.graphics);

var grid2 = new UIGrid(3,6);
grid2.graphics.position.set(500,300);
stage.addChild(grid2.graphics);

var grid3 = new UIGrid(1,1);
grid3.spatialConstraint = false;
grid3.graphics.position.set(500,500);
stage.addChild(grid3.graphics);


var items = [
    new UIGridItem(Cache.textures['items/1x4'], 1, 4, Cache.textures['items/1x1']),
    new UIGridItem(Cache.textures['items/2x3'], 2, 3, Cache.textures['items/1x1']),
    new UIGridItem(Cache.textures['items/2x2'], 2, 2, Cache.textures['items/1x1']),
    new UIGridItem(Cache.textures['items/2x1'], 2, 1, Cache.textures['items/1x1']),
    new UIGridItem(Cache.textures['items/2x1'], 2, 1, Cache.textures['items/1x1']),
    new UIGridItem(Cache.textures['items/1x2'], 1, 2, Cache.textures['items/1x1']),
];

grid1.populate(items);

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





