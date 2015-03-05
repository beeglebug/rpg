/* jshint node: true */
'use strict';

/**
 * @mixin
 */
var EventEmitterMixin = function () {

    /**
     * register a listener
     * @param {string} event
     * @param {Function} callback
     */
    this.addEventListener = function (event, fn) {

        this._listeners = this._listeners || {};

        if (!this._listeners[event]) {

            this._listeners[event] = [];

        }

        // todo generate an id and return it, use that to remove events

        this._listeners[event].push(fn);

        return this;
    };


    /**
     * remove a single callback for a specific event
     * @param  {String} event the event type
     * @param  {Function} callback the callback to remove
     * @return {Boolean} true if a listener was removed
     */
    this.removeEventListener = function (event, fn) {

        this._listeners = this._listeners || {};

        if (!this._listeners[event]) {
            return false;
        }

        this._listeners[event].forEach(function (listener, ix, listeners) {
            if (listener === fn) {
                listeners.splice(ix, 1);
            }
        });

        return true;
    };

    /**
     * remove all event listeners, or only those for a specific event
     * @param  {String} [event] the type of event to remove
     * @return {Boolean} false if nothing was deleted, otherwise true
     */
    this.removeAllListeners = function (event) {

        this._listeners = this._listeners || {};

        if (event) {

            if (!this._listeners[event]) {
                return false;
            }

            this._listeners[event] = [];

        } else {

            if (!this.listeners.length) {
                return false;
            }

            this.listeners = {};

        }

        return true;
    };

    /**
     * fire any listeners registered for the event
     * @param  {String} event
     */
    this.emit = function (event) {

        this._listeners = this._listeners || {};

        if (!this._listeners[event]) {
            return false;
        }

        var args = Array.prototype.slice.call(arguments, 1);

        this._listeners[event].forEach(function (listener) {

            listener.apply(this, args);

        }, this);

        return true;

    };
};

module.exports = EventEmitterMixin;