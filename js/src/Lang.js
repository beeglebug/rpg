/* jshint node: true */
'use strict';

var deepProperty = require('util/deepProperty');

var Lang = {

    locale : 'en',

    get : function(key) {

        key = this.locale + '.' + key;

        return deepProperty(this.data, key);
    },

    data : {
        // todo load from json
    }
};

module.exports = Lang;