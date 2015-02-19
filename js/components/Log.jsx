/** @jsx React.DOM */
var Log = React.createClass({

    componentDidMount: function () {

        Logger.addEventListener('log-item-added', this.update);

    },

    getInitialState: function () {
        return {
            messages: []
        };
    },

    update: function () {

        this.setState({
            messages: Logger.getAll()
        })
    },

    render: function () {
        return (
            <ul>
            { this.state.messages.map(function (item) {
                return <LogMessage message={item}/>
            }) }
            </ul>
        );
    }
});
