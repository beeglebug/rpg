/**
 * something which can be picked up
 * and placed in an inventory
 * @constructor
 * todo pass an options object with all the settings
 * make a factory to make items, data pulled from json files
 */
var InventoryItem = function(width, height, name) {

    // position and size in the inventory
    this.position = new PIXI.Point();
    this.width = width || 1;
    this.height = height || 1;

    this.name = name;
};