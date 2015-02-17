/**
 * something which can be picked up
 * and placed in an inventory
 * @constructor
 */
var InventoryItem = function(width, height) {

    this.width = width || 1;
    this.height = height || 1;
    this.position = new PIXI.Point();

};