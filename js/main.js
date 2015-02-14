var stage = new PIXI.Stage(0xDDDDDD, true);
var renderer = PIXI.autoDetectRenderer(800, 600);
var ui = new PIXI.DisplayObjectContainer();

// init singletons
DragDrop.init(ui);
Debug.init(stage);

Loader.add([
    'img/target.png',
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

var player = new Mob();

// map
var map = generateMap(19,19);
var tileset = new TileSet(32, 32);
var mapRenderer = new MapRenderer(400, 300, map, tileset);
//stage.addChild(mapRenderer.container);
mapRenderer.container.position.set(10, 10);

ui.scale.set(2,2);
stage.addChild(ui);



// uigrid testing
var grid1 = new UIGrid(6,6);
grid1.graphics.position.set(220,10);
ui.addChild(grid1.graphics);


DragDrop.registerDropTarget(grid1);

var items = [
    new UIGridItem('img/items/1x4.png', 1, 4, 'img/items/1x1.png'),
    new UIGridItem('img/items/2x3.png', 2, 3, 'img/items/1x1.png'),
    new UIGridItem('img/items/2x2.png', 2, 2, 'img/items/1x1.png'),
    new UIGridItem('img/items/2x1.png', 2, 1, 'img/items/1x1.png'),
    new UIGridItem('img/items/2x1.png', 2, 1, 'img/items/1x1.png'),
    new UIGridItem('img/items/1x2.png', 1, 2, 'img/items/1x1.png'),
];

grid1.populate(items);

player.moveToTile(map.getTileAt(3,3));



// add to stage last so its on top
stage.addChild(Debug.container);

/**
 * main loop
 */
/**
 * main loop
 */
function animate(time) {

    requestAnimFrame( animate );

    TWEEN.update(time);

    isoUpdate();

    renderer.render(stage);
}

requestAnimFrame( animate );


requestAnimFrame( animate );



function distanceBetween(a, b) {

    var dx = Math.abs(a.x - b.x),
        dy = Math.abs(a.y - b.y);

    return (dx * dx) + (dy * dy);
}
