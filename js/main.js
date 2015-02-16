var stage = new PIXI.Stage(0xDDDDDD, true);
var renderer = PIXI.autoDetectRenderer(800, 600);
var ui = new PIXI.DisplayObjectContainer();
stage.addChild(ui);
ui.scale.set(2);
// init singletons
DragDrop.init(ui);
Debug.init(stage);

Loader.add([
    'img/items/1x1.png',
    'img/items/2x1.png',
    'img/items/1x2.png',
    'img/items/1x4.png',
    'img/items/2x2.png',
    'img/items/2x3.png',
    'font/munro.fnt'
]);

Loader.load(function() {
    //var bitmapFontText = new PIXI.BitmapText("test bitmap text", {font: "11px Munro", align: "right"});
    //bitmapFontText.position.x = 620 - bitmapFontText.width - 20;
    //bitmapFontText.position.y = 20;
    //stage.addChild(bitmapFontText);
});

// add to dom
document.getElementById('canvas-wrapper').appendChild(renderer.view);


// uigrid testing
var grid1 = new UIGrid(6,6);
grid1.graphics.position.set(220,50);
ui.addChild(grid1.graphics);

DragDrop.registerDropTarget(grid1);

var items = [
    new UIGridItem('img/items/1x4.png', 1, 4, 'img/items/1x1.png'),
    new UIGridItem('img/items/2x3.png', 2, 3, 'img/items/1x1.png'),
];

// add to stage last so its on top
stage.addChild(Debug.container);

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


function distanceBetween(a, b) {

    var dx = Math.abs(a.x - b.x),
        dy = Math.abs(a.y - b.y);

    return (dx * dx) + (dy * dy);
}
