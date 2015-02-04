var Debug = {};

Debug.init = function(stage) {
  
    this.container = new PIXI.DisplayObjectContainer();
    
    this.mousePos = new PIXI.Text('0,0', { font: '10px Verdana', fill: '#333333' });
    this.mousePos.position.set(750,10);
    
    this.container.addChild(this.mousePos);
};

Debug.setMousePos = function(pos) {
    
    this.mousePos.setText(pos.x + ',' + pos.y);
    
};
    