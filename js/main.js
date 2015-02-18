var stage = new PIXI.Stage(0xDDDDDD, true);
var renderer = PIXI.autoDetectRenderer(800, 600);
// add to dom
document.getElementById('canvas-wrapper').appendChild(renderer.view);

var ui = new PIXI.DisplayObjectContainer();

// init singletons
DragDropManager.init();

Loader.add([
    'font/munro.fnt'
]);

Loader.load(function() {
    //var bitmapFontText = new PIXI.BitmapText("test bitmap text", {font: "11px Munro", align: "right"});
    //bitmapFontText.position.x = 620 - bitmapFontText.width - 20;
    //bitmapFontText.position.y = 20;
    //stage.addChild(bitmapFontText);
});

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