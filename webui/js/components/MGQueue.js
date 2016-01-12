var React = require('react');

var Card = require('material-ui/lib/card/card');
var CardHeader = require('material-ui/lib/card/card-header');
var List= require('material-ui/lib/lists/list');
var ListItem =require('material-ui/lib/lists/list-item');

function getQueueState() {
	return {
		data: [{artist: 'Taylor Swift', title:'Speak Now'}]
	}
}

var MGQueue = React.createClass({
	getInitialState: function (){
		return getQueueState();
	},
	render: function () {
		return <div style={this.props.style}>
      <List subheader="Queue">
			 {this.state.data.map(function (e, i){
  				return <ListItem key={"queue-" + i}>
  					{e.artist} - {e.title}
  				</ListItem>
  			})}
		  </List>
    </div>
	}
});

module.exports = MGQueue;