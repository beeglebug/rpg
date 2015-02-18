var Button = function(text, callback) {

    PIXI.DisplayObjectContainer.call(this);

    this.text = new PIXI.BitmapText(text, { font: "11px Munro", align: "center" });

    var margin = 5;

    this.background = new PIXI.Graphics();
    this.background.beginFill(0x000000);
    this.background.drawRect(0, 0, this.text.width + (margin*2), this.text.height + (margin*2));

    this.text.position.set(margin, margin);

    this.addChild(this.background);
    this.addChild(this.text);

    this.callback = callback;

    this.interactive = true;

    this.click = this.onClick;
    this.mouseover = this.onMouseOver;
    this.mouseout = this.onMouseOut;
};

Button.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);

Button.prototype.onClick = function(e) {
    this.callback();
};
Button.prototype.onMouseOver = function(e) {
    this.background.alpha = 0.5;
};
Button.prototype.onMouseOut = function(e) {
    this.background.alpha = 1;
};