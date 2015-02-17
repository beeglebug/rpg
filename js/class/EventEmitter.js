/**
 * mixin
 */
var EventEmitter = {

    mixin: function (prototype) {

        prototype._listeners = {};

        /**
         * register a listener
         * @param  {[type]}   event    [description]
         * @param  {Function} callback [description]
         * @return {[type]}            [description]
         */
        prototype.addEventListener = function (event, fn) {

            if (!this._listeners[event]) {

                this._listeners[event] = [];

            }

            this._listeners[event].push(fn);

            return this;
        };


        /**
         * remove a single callback for a specific event
         * @param  {String} event the event type
         * @param  {Function} callback the callback to remove
         * @return {Boolean} true if a listener was removed
         */
        prototype.removeEventListener = function (event, fn) {

            if (!this._listeners[event]) {
                return false;
            }

            this._listeners[event].forEach(function (listener, ix, listeners) {

                if (listener == fn) {

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
        prototype.removeAllListeners = function (event) {

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
        prototype.emit = function (event) {

            if (!this._listeners[event]) {
                return false;
            }

            var args = Array.prototype.slice.call(arguments, 1);

            this._listeners[event].forEach(function (listener) {

                listener.apply(this, args);

            }, this);

            return true;

        };
    }
};