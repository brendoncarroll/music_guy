var React = require('react');
var MGAPI = require('../actions/MGAPI');

var TextField = require('material-ui/lib/text-field');

var MGSearchBar = React.createClass({
  onChange: function (event) {
    MGAPI.search(event.target.value);
  },
  render: function () {
    return <div>
      <TextField fullWidth={true} hintText="Search"
      onChange={this.onChange}/>
    </div>
  }
});

module.exports = MGSearchBar;