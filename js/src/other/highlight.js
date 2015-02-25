// map highlight
var highlight = {

    position: new PIXI.Point(),

    sprite: new PIXI.Sprite(),

    init : function() {

        this.sprite = PIXI.Sprite.fromFrame('highlight.png');
        this.sprite.setAnchor(17, 0);

    },

    setTile: function(tile) {

        if (tile) {
            this.move(tile.position);
            this.show();

            if(tile.visibility == 0) {
                this.sprite.alpha = 0.1;
            } else {
                this.sprite.alpha = 1;
            }

        } else {
            this.hide();
        }
    },

    move: function (pos) {

        if (this.position.equals(pos)) {
            return;
        }

        this.setPosition(pos);
    },

    setPosition: function (pos) {

        this.position.set(pos.x, pos.y);

        this.sprite.position.set(pos.x, pos.y);

        mapToScreen(this.sprite.position);
    },

    show: function () {
        this.sprite.visible = true;
    },

    hide: function () {
        this.sprite.visible = false;
    }
};