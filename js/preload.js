// preload textures
var preload = [
    'map-edge',
    'house-n',
    'house-s',
    'road-h',
    'road-v',
    'road-t-s',
    'garden-n',
    'garden-s',
    'items/1x1',
    'items/2x1',
    'items/1x2',
    'items/2x3',
];

var TextureCache = {};

preload.forEach(function(key) {
    var src = 'img/' + key + '.png';
    TextureCache[key] = PIXI.Texture.fromImage(src);
});
