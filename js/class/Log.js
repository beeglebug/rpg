var Log = {

    history : [],

    domNode : null,

    init : function(domNode) {

        this.domNode = domNode;

    },

    add : function(message) {

        this.history.push(message);

        this.domNode.append()

    }

};