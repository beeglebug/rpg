// map highlight
var highlight = {

    position: new PIXI.Point(),

    sprite: new PIXI.Sprite(),

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