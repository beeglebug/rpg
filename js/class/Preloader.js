var Preloader = {};

Preloader.loadTextures = function (textures) {

    textures.forEach(function (key) {

        var src = 'img/' + key + '.png';

        Cache.addTexture(key, PIXI.Texture.fromImage(src));
    });
};