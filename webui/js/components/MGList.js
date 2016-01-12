var React = require('react');

var Card = require('material-ui/lib/card/card');
var CardHeader = require('material-ui/lib/card/card-header');
var List= require('material-ui/lib/lists/list');
var ListItem =require('material-ui/lib/lists/list-item');
var Paper = require('material-ui/lib/paper');

var Table = require('material-ui/lib/table/table');
var TableBody = require('material-ui/lib/table/table-body');
var TableFooter = require('material-ui/lib/table/table-footer');
var TableHeader = require('material-ui/lib/table/table-header');
var TableHeaderColumn = require('material-ui/lib/table/table-header-column');
var TableRow = require('material-ui/lib/table/table-row');
var TableRowColumn = require('material-ui/lib/table/table-row-column');

var MGAPI = require('../actions/MGAPI.js')
var SongStore = require('../stores/SongStore.js');
var PlayerActions = require('../actions/PlayerActions.js');

function getSongState() {
  return SongStore.getAll();
}

////
// Tracks
////2
var MGListTrack = React.createClass({
  handleDoubleClick: function (event) {
    PlayerActions.queueSong(this.props.data);
  },
  render: function () {
    d = this.props.data;
    
    return <TableRow onDoubleClick={this.handleDoubleClick}>
      <TableRowColumn>{d.artist}</TableRowColumn>
      <TableRowColumn>{d.album}</TableRowColumn>
      <TableRowColumn>{d.title}</TableRowColumn>
    </TableRow>
  }
});

var MGListTrackSection = React.createClass({
  render: function () {
    var stuff = [];
    this.props.data.forEach(function (e) {
      stuff.push(<MGListTrack data={e} />);
    });
    return <div>
      <Card>
        <CardHeader
          style={{height: 10}}
          title="Tracks"/>
        <Table>
        <TableHeader displaySelectAll={false}>
          <TableRow>
            <TableHeaderColumn>Artist</TableHeaderColumn>
            <TableHeaderColumn>Album</TableHeaderColumn>
            <TableHeaderColumn>Title</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stuff}
        </TableBody>
        </Table>
      </Card>
    </div>
  }
});

////
// Artists
////
var MGListArtist = React.createClass({
  render: function () {
    d = this.props.data;
    return <ListItem>{d.name}</ListItem>
  }
});

var MGListArtistSection = React.createClass({
  render: function () {
    var items = [];
    this.props.data.forEach(function (e) {
      items.push(<MGListArtist data={e}/>);
    });
    return <Card>
      <CardHeader title="Artists"/>
      <List>
        {items}
      </List>
    </Card>
  }
});

////
//  Albums
////

var MGListAlbum = React.createClass({
  render: function () {
    return <li>

    </li>
  }
});

var MGListAlbumSection = React.createClass({
  render: function () {
    return <div>
      <h4>Albums</h4>
    </div>
  }
});

var MGListSection = React.createClass({
  render: function () {
    var name = this.props.name;
    var d = this.props.data;
    var section = <span></span>;
    switch (name) {
      case "titles":
        section = <MGListTrackSection data={d} />;
        break;
      case "artists":
        section = <MGListArtistSection data={d} />;
        break;
      // case "albums":
      //   section = <MGListAlbumSection data={d} />;
      //   break;
    }
    return section;
  }
});

var MGList = React.createClass({

  getInitialState: function () {
    return getSongState();
  },

  componentDidMount: function () {
    SongStore.on('change', this._onChange);
    MGAPI.random();
  },

  componentWillUnmount: function () {
    SongStore.removeListener('change', this._onChange);
  },

  _onChange: function () {
    this.setState(getSongState());
  },

  render: function () {
    var things = [];
    for (var key in this.state) {
      things.push(<MGListSection key={key} name={key} data={this.state[key]}/>);
    }
    return <div style={this.props.style}>
      {things}
    </div>
  }
});

module.exports = MGList;