var React = require('react');

var MGAPI = require('../actions/MGAPI.js')
var SongStore = require('../stores/SongStore.js');
var PlayerActions = require('../actions/PlayerActions.js');

function getSongState() {
  return SongStore.getAll();
}

////
// Tracks
////
var MGListTrack = React.createClass({
  handleDoubleClick: function (event) {
    PlayerActions.queueSong(this.props.data);
  },
  render: function () {
    d = this.props.data;
    return <tr onDoubleClick={this.handleDoubleClick}>
      <td >{d.artist}</td>
      <td>{d.album}</td>
      <td >{d.title}</td>
    </tr>
  }
});

var MGListTrackSection = React.createClass({
  render: function () {
    var stuff = [];
    this.props.data.forEach(function (e) {
      stuff.push(<MGListTrack data={e} />);
    })
    return <div>
      <h4>Tracks</h4>
      <table>
      <tbody>
        <tr><th>Artist</th><th>Album</th><th>Title</th></tr>
        {stuff}
      </tbody>
      </table>
    </div>
  }
});

////
// Artists
////
var MGListArtist = React.createClass({
  render: function () {
    return <li>

    </li>
  }
});

var MGListArtistSection = React.createClass({
  render: function () {
    return <div>
      <h4>Artists</h4>
    </div>
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
    switch (name) {
      case "titles":
        return <MGListTrackSection data={d} />;
        break;
      case "artists":
        return <MGListArtistSection data={d} />;
        break;
      case "albums":
        return <MGListAlbumSection data={d} />;
        break;
      default:
        return <div></div>
    }
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
    for (key in this.state) {
      things.push(<MGListSection name={key} data={this.state[key]}/>);
    }
    return <div>
      <ul>
        {things}
      </ul>
    </div>
  }
});

module.exports = MGList;