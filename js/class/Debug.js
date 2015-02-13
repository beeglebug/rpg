var Debug = {};

Debug.init = function(stage) {
  
    this.container = new PIXI.DisplayObjectContainer();
    
    this.mousePos = new PIXI.Text('0,0', { font: '10px Verdana', fill: '#333333' });
    this.mousePos.position.set(750, 10);

    this.tilePos = new PIXI.Text('0,0', { font: '10px Verdana', fill: '#333333' });
    this.tilePos.position.set(750, 30);

    this.target = new PIXI.Sprite.fromImage('img/target.png');
    this.target.anchor.set(0.454545,0.454545);

    //this.container.addChild(this.target);
    this.container.addChild(this.mousePos);
    this.container.addChild(this.tilePos);
};

Debug.setMousePos = function(pos) {
    this.mousePos.setText(pos.x + ',' + pos.y);
};

Debug.setTilePos = function(x, y) {
    this.tilePos.setText(x + ',' + y);
};

Debug.setTarget = function(x, y) {
    this.target.position.set(x, y);
};

    