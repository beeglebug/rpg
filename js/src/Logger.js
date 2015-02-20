var Logger = {

    history: [],

    log: function (message) {

        this.history.push(message);

        this.emit('log-item-added');
    },

    getAll: function () {

        return this.history;

    }

};

EventEmitterMixin.call(Logger);