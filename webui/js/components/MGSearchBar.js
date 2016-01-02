var React = require('react');
var MGAPI = require('../actions/MGAPI');

var MGSearchBar = React.createClass({
  getInitialState: function () {
    return {
      value: ""
    };
  },
  onChange: function (event) {
    this.state.value = event.target.value;
    MGAPI.search(this.state.value);
  },
  render: function () {
    return <div>
      <input type="text" onChange={this.onChange}/>
    </div>
  }
});

module.exports = MGSearchBar;