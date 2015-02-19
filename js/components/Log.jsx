/** @jsx React.DOM */
var Log = React.createClass({
    render: function () {
        return (
            <ul>
            {
                this.state.history.map(function (item) {
                    return <LogMessage message={item}/>
                })
                }
            </ul>
        );
    }
});
