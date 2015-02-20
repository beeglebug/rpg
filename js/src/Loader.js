var Loader = {
    assets : []
};

Loader.add = function (assets) {

    this.assets = this.assets.concat(assets);

};

Loader.load = function(callback) {

    var loader = new PIXI.AssetLoader(this.assets);

    loader.onComplete = callback;

    loader.load();
};