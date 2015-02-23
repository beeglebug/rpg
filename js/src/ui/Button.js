/**
 *
 * @param text
 * @param callback
 * @param width
 * @param height
 * @constructor
 * @extends PIXI.DisplayObjectContainer
 */
var Button = function(text, callback, width, height) {

    PIXI.DisplayObjectContainer.call(this);

    this.text = new PIXI.BitmapText(text, { font: "11px Munro", align: "center" });

    var margin = 5;

    width = width || this.text.textWidth + (margin * 2);
    height = height || this.text.textHeight + (margin * 2);

    this.background = new PIXI.Graphics();
    this.background.beginFill(0x000000);
    this.background.drawRect(0, 0, width, height);

    this.text.position.set(margin, margin);

    this.addChild(this.background);
    this.addChild(this.text);

    this.callback = callback;

    this.interactive = true;

    this.click = this.onClick;
    this.mouseover = this.onMouseOver;
    this.mouseout = this.onMouseOut;
    this.mousedown = this.onMouseDown;
    this.mouseup = this.onMouseUp;
};

Button.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);

Button.prototype.onClick = function(e) {
    this.callback();
};

Button.prototype.onMouseOver = function(e) {
    this.background.alpha = 0.7;
};

Button.prototype.onMouseOut = function(e) {
    this.background.alpha = 1;
};

Button.prototype.onMouseDown = function(e) {
    this.background.alpha = 0.8;
};

Button.prototype.onMouseUp = function(e) {
    this.background.alpha = 0.7;
};