var Debug = {};

Debug.init = function(stage) {
  
    this.container = new PIXI.DisplayObjectContainer();
    
    this.mousePos = new PIXI.Text('0,0', { font: '10px Verdana', fill: '#333333' });
    this.mousePos.position.set(750,10);

    this.target = new PIXI.Sprite.fromImage('img/target.png');
    this.target.anchor.set(0.454545,0.454545);

    //this.container.addChild(this.target);
    this.container.addChild(this.mousePos);
};

Debug.setMousePos = function(pos) {
    
    this.mousePos.setText(pos.x + ',' + pos.y);
};

Debug.setTarget = function(x, y) {

    this.target.position.set(x, y);
};

    