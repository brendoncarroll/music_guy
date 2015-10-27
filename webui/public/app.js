
var MGListItem = React.createClass({
  onDoubleClick: function (event) {
    p.changeSong(this.props.data);
  },
  render: function () {
    return <tr onDoubleClick={this.onDoubleClick}>
      <td>{this.props.data.artist}</td>
      <td>{this.props.data.title}</td>
      <td>{this.props.data.album}</td>
    </tr>
  }
});

var MGSearchBar = React.createClass({
  getInitialState: function () {
    return {
      value: ""
    };
  },
  onChange: function (event) {
    this.state.value = event.target.value;
    var param = $.param({
      q: this.state.value
    });
    $.getJSON('library/search?' + param, function (data) {
      d.emit('songListUpdate', data.songs);
    });
  },
  render: function () {
    return <div>
      <input type="text" onChange={this.onChange}/>
    </div>
  }
});

var MGList = React.createClass({
  componentDidMount: function () {
    d.on('songListUpdate', function (songs) {
      this.setState({
        songs: songs
      });
      console.log(this.state);
    }.bind(this));
    $.getJSON('library/songs', function (data) {
      this.setState({
        songs: data.songs
      });
    }.bind(this));
  },
  getInitialState: function () {
    return {
      songs: []
    };
  },
  render: function () {
    var items = this.state.songs.map(function (elem) {
      return <MGListItem data={elem} key={elem._id}/>
    });
    return <div>
      <table>
        <tr>
          <th>Artist</th>
          <th>Title</th>
          <th>Album</th>
        </tr>
        {items}
      </table>
    </div>
  }
});

var MGSongInline = React.createClass({
  render: function () {
    if (this.props.data === undefined) return <span></span>
    return <span>
      <b>{this.props.data.artist}</b> {this.props.data.title}
    </span>
  }
});

var MGTime = React.createClass({
  render: function () {
    if (this.props.ms === undefined) {
      this.props.ms = 0;
    }

    var ms = this.props.ms;
    var hh = Math.floor(ms / 36e5);
    var mm = Math.floor((ms % 36e5) / 6e4);
    var ss = Math.floor((ms % 6e4) / 1000);

    var parts = [hh, mm, ss].map(function (elem) {
      if (elem.toString().length < 2) return '0'+ elem;
      else return elem;
    });

    return <span>
      {parts.join(":")}
    </span>
  }
});

var MGPlayerButtons = React.createClass({
  render: function () {
    var parts = [];
    parts.push(<input type="button" value="<<"/>);
    if (this.props.data) {
      parts.push(<input type="button" value="PAUSE"/>);
    } else {
      parts.push(<input type="button" value="PLAY"/>);
    }
    parts.push(<input type="button" value=">>"/>);

    return <div>
      {parts}
    </div>
  }
});

var MGPlayerWaveform = React.createClass({
  componentDidMount: function () {
    console.log(this.getDOMNode());
    var waveform = new Waveform({
      container: this.getDOMNode(),
      height: 50,
      data: [0, 0.1, 0.5],
      innerColor: "#FF8800",
    });
    $.getJSON('/library/waveforms/0', function (data) {
      waveform.update({
        data: data
      });
    });
  },
  render: function () {
    return <div></div>
  }
});

var MGPlayer = React.createClass({
  getInitialState: function () {
    return this.props.data.getState();
  },
  componentDidMount: function () {
    d.on('playerUpdate', function (player) {
      this.setState(player.getState);
    }.bind(this));
  },
  render: function () {
    return <div>
      Now Playing: <MGSongInline data={this.state.nowPlaying}/>
      <MGPlayerWaveform/>
      <MGPlayerButtons data={this.state.isPlaying}/>
      <MGTime ms={this.state.currentTime}/> / <MGTime ms={this.state.duration}/>
    </div>
  }
});

var MusicGuyUI = React.createClass({
  render: function () {
    return <div>
      <MGSearchBar/>
      <MGPlayer data={p}/>
      <MGList/>
    </div>;
  }
});

function newDispatcher () {
  var that = {
    events: {}
  };
  that.on = function (event, callback) {
    if (that.events[event] === undefined) {
      that.events[event] = [];
    }
    that.events[event].push(callback);
  };
  that.emit = function () {
    var callbacks = that.events[arguments[0]];
    var args = Array.prototype.slice.call(arguments);
    if (callbacks === undefined) return;
    if (callbacks.constructor === Array) {
      callbacks.forEach(function (elem) {
        elem.apply(null, args.slice(1));
      });
    }
  };
  return that;
}

function newController() {
  var that = {};

  var ws = new WebSocket('ws://' + location.host);
  ws.onmessage = function (event) {
    console.log(event);
  }
  return that;
}

function newPlayer() {
  var that = {};

  function handleProgress() {
    d.emit('playerUpdate', that);
  }

  that.usePlayer = function (player) {
    that.player = player;
    player.on('progress', handleProgress);
    player.on('end', that.stop);
    player.asset.on('data', function (data) {
      d.emit('playerDecode', data);
    })
  }

  that.play = function () {
    if (that.player) that.player.play();
  }

  that.pause = function () {
    if (that.player) that.player.pause();
  }

  that.stop = function () {
    if (that.player) {
      that.player.stop();
      d.emit('playerUpdate', that);
    }
  }

  that.changeSong = function (song) {
    that.stop();
    that.usePlayer(new AV.Player.fromURL('/stream/' + song._id));
    that.nowPlaying = song;
    that.player.play();
    d.emit('playerUpdate', that);
  }

  that.isPlaying = function () {
    if (that.player === undefined) {
      return false;
    } else {
      return that.player.playing;
    }
  }

  that.getState = function () {
    var state = {
      nowPlaying: that.nowPlaying,
      isPlaying: that.isPlaying(),
    }
    if (that.player !== undefined) {
      state.duration = that.player.duration;
      state.currentTime = that.player.currentTime;
    }
    return state;
  }

  d.on('requestPlayerState', function (state) {
    if (state.isPlaying) {
      player.play();
    } else {
      player.pause();
    }
  });

  return that;
}

d = newDispatcher();
p = newPlayer();
React.render(<MusicGuyUI/>, document.getElementById('app'));