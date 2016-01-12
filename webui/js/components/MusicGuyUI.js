"use strict";

var React = require('react');

var Paper = require('material-ui/lib/paper');

var MGSearchBar = require('./MGSearchBar.js');
var MGList = require('./MGList.js');
var MGPlayer = require('./MGPlayer.js');
var MGQueue = require('./MGQueue.js');

var MusicGuyUI = React.createClass({
  render: function () {
    var listStyle = {
      width: '85%',
      float: 'left',
    };
    var queueStyle = {
      width: '15%',
      float: 'right',
    };
    return <div>
      <MGSearchBar />
      <MGList style={listStyle}/>
      <MGQueue style={queueStyle}/>
      <MGPlayer/>
    </div>
  }
});

module.exports = MusicGuyUI;
