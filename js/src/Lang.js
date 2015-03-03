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