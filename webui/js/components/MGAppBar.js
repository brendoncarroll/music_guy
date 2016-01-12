var React = require('react');

var AppBar = require('material-ui/lib/app-bar');

var MGSearchBar = require('./MGSearchBar.js');

var MGAppBar = React.createClass({
	render: function () {
		return <div>
			<AppBar title="MusicGuy" />
		</div>
	},
});

module.exports = MGAppBar;