/* jshint node: true */
'use strict';

var PIXI = require('pixi');
var DragDropManager = require('ui/DragDropManager');

/**
 * a draggable object
 * @param displayObject
 * @param type
 * @constructor
 * @extends PIXI.DisplayObjectContainer
 */
var Draggable = function(displayObject, type) {

    PIXI.DisplayObjectContainer.call(this);

    this.addChild(displayObject);

    this.type = type || null;

    this.interactive = true;

    this.mousedown = function(e) {
        DragDropManager.onDragStart(e, this);
    }.bind(this);

    this.mouseup = function(e) {
        DragDropManager.onDrop(e, this);
    }.bind(this);

    this.mouseupoutside = function(e) {
        DragDropManager.onDrop(e, this);
    }.bind(this);

};

Draggable.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);

module.exports = Draggable;