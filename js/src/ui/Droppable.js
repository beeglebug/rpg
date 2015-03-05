/* jshint node: true */
'use strict';

var PIXI = require('pixi');
var DragDropManager = require('DragDropManager');
var EventEmitterMixin = require('EventEmitterMixin');

/**
 * A display object which can accept draggables
 * @param displayObject
 * @param accepts
 * @constructor
 * @extends PIXI.DisplayObjectContainer
 * @mixes EventEmitterMixin
 */
var Droppable = function(displayObject, accepts) {

    PIXI.DisplayObjectContainer.call(this);

    this.interactive = true;

    this.addChild(displayObject);

    this.accepts = accepts || null;

    this.hitArea = displayObject.getBounds();

    // cached point for drop calculations
    this._temp = new PIXI.Point();

    // register self with manager
    DragDropManager.addDropTarget(this);
};

Droppable.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);

EventEmitterMixin.call(Droppable.prototype);


/**
 * something has been dragged over this
 */
Droppable.prototype.onDragOver = function(e, draggable) {

    // pass the event on to anything listening
    this.emit('drag-over', e, draggable);
};


Droppable.prototype.acceptDrop = function(e, draggable) {

    // pass the event on to anything listening
    this.emit('drop-accepted', e, draggable);
};

/**
 * check if this droppable can accept the draggable
 */
Droppable.prototype.canAcceptDrop = function(e, draggable) {

    if(this.accepts && draggable.type !== this.accepts) { return false; }

    return true;
};

module.exports = Droppable;