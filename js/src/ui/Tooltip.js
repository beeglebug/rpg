var Tooltip = {

    graphics: null,
    text: null,
    margin: 5,
    timeout: null,
    delay: 500,

    init: function () {

        this.graphics = new PIXI.Graphics();

        this.text = new PIXI.BitmapText(text, { font: "11px Munro" });

        this.graphics.addChild(this.text);

        this.setText('');
    },

    setText: function(text) {

        this.text.setText(text);

        this.graphics.clear();
        this.graphics.beginFill(0x000000);
        this.graphics.drawRect(0, 0, this.text.textWidth + (this.margin * 2), this.text.textHeight + (this.margin * 2));
    },

    onMouseMove: function(e) {

        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.update.bind(this), this.delay);

    },

    update: function() {

        // check what we are over


    }

};