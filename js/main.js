var stage = new PIXI.Stage(0xDDDDDD, true);
var renderer = PIXI.autoDetectRenderer(800, 600);

// init singletons
DragDrop.init(stage);
Debug.init(stage);

Loader.add([
    'img/map-edge.png',
    'img/house-n.png',
    'img/house-s.png',
    'img/road-h.png',
    'img/road-v.png',
    'img/road-t-s.png',
    'img/garden-n.png',
    'img/garden-s.png',
    'img/items/1x1.png',
    'img/items/2x1.png',
    'img/items/1x2.png',
    'img/items/1x4.png',
    'img/items/2x2.png',
    'img/items/2x3.png',
    'font/munro.fnt'
]);

Loader.load(function() {

    var bitmapFontText = new PIXI.BitmapText("test bitmap text", {font: "11px Munro", align: "right"});
    bitmapFontText.position.x = 620 - bitmapFontText.width - 20;

    bitmapFontText.position.y = 20;
    stage.addChild(bitmapFontText);
});

// add to dom
document.getElementById('canvas-wrapper').appendChild(renderer.view);

var player = {
    position : new PIXI.Point(),
    onTile : null
};

// map
var mapData = generateMap(15, 15);
var tileset = new TileSet(32, 32);
var map = new MapRenderer(288, 288, mapData, tileset);
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
    new UIGridItem('img/items/1x4.png', 1, 4, 'img/items/1x1.png'),
    new UIGridItem('img/items/2x3.png', 2, 3, 'img/items/1x1.png'),
    new UIGridItem('img/items/2x2.png', 2, 2, 'img/items/1x1.png'),
    new UIGridItem('img/items/2x1.png', 2, 1, 'img/items/1x1.png'),
    new UIGridItem('img/items/2x1.png', 2, 1, 'img/items/1x1.png'),
    new UIGridItem('img/items/1x2.png', 1, 2, 'img/items/1x1.png'),
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



