var React = require('react');

var MGSearchBar = require('./MGSearchBar.js');
var MGList = require('./MGList.js');
var MGPlayer = require('./MGPlayer.js');

var MusicGuyUI = React.createClass({
  render: function () {
    return <div>
      <MGSearchBar />
      <MGPlayer />
      <MGList />
    </div>
  }
});

module.exports = MusicGuyUI;
