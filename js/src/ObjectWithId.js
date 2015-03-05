/* jshint node: true */
'use strict';

/**
 * base class for objects with a unique id
 */
var ObjectWithId = function() {

    this.id = this._getId();

};

/**
 * get the next unique id number
 * @returns {number}
 * @private
 */
ObjectWithId.prototype._getId = function() {

    return ObjectWithId._currentId++;

};

/**
 * the current auto increment id
 * @type {number}
 * @private
 * @static
 */
ObjectWithId._currentId = 0;

module.exports = ObjectWithId;