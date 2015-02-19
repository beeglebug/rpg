/** @jsx React.DOM */
var LogMessage = React.createClass({
    render: function () {
        return (
            <li>{this.props.message}</li>
        );
    }
});
