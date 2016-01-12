var React = require('react');

var Toolbar = require('material-ui/lib/toolbar/toolbar');
var ToolbarGroup = require('material-ui/lib/toolbar/toolbar-group');

var PlayerStore = require('../stores/PlayerStore.js');
var PlayerActions = require('../actions/PlayerActions.js');

var MGPlayerButtons = React.createClass({
    render: function () {
    var parts = [];
    parts.push(<input type="button" value="<<"/>);
    if (this.props.isPlaying) {
      parts.push(<input onClick={PlayerActions.pause} type="button" value="PAUSE"/>);
    } else {
      parts.push(<input onClick={PlayerActions.play} type="button" value="PLAY"/>);
    }
    parts.push(<input type="button" value=">>"/>);

    return <span>
      {parts}
    </span>
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
    if (this.props.ms === undefined || this.props.ms === NaN) {
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

var SLIDER_WIDTH = 500;
var MGSlider = React.createClass({
    handleClick: function (e) {
        var cx = e.clientX;
        var cy = e.clientY;
        var crect = e.target.getBoundingClientRect();
        var localx = cx - crect.left;
        var seekms = (localx / SLIDER_WIDTH * this.props.duration);
        PlayerActions.seek(seekms);
    },
    render: function () {
        var SLIDER_COLOR = "lightgrey";
        
        var PLAYED_COLOR = "purple";

        var buffX = this.props.buffered / 100 * SLIDER_WIDTH;
        if (!buffX) buffX = 0;

        var posX = this.props.currentTime / this.props.duration * SLIDER_WIDTH;
        if (!posX) posX = 0;

        return <svg onClick={this.handleClick} height="4" width={SLIDER_WIDTH}>
            <line x1={0} x2={SLIDER_WIDTH} y1={0} y2={0}
                stroke={SLIDER_COLOR} strokeWidth={4} />
            <line x1={0} x2={buffX} y1={1} y2={1}
                stroke="darkgrey" />
            <line x1={0} x2={posX} y1={1} y2={1} stroke={PLAYED_COLOR} />
        </svg>
    },
});

var MGPlayer = React.createClass({
    getInitialState: function () {
        return PlayerStore.getState();
    },
    _onChange: function () {
        this.setState(PlayerStore.getState());
    },
    componentDidMount: function () {
        PlayerStore.on('change', this._onChange);
    },
    componentWillUnmount: function () {
        PlayerStore.remove('change', this._onChange);
    },
    render: function () {
      var style = {
        position: "fixed",
        bottom: "0",
        width: "100%",
      }
      return <div style={style}>
        <Toolbar>
        <ToolbarGroup>
          Now Playing: <MGSongInline data={this.state.nowPlaying}/>
          <MGPlayerButtons isPlaying={this.state.isPlaying}/>
          <MGSlider buffered={this.state.buffered} currentTime={this.state.currentTime} duration={this.state.duration}/>
          <MGTime ms={this.state.currentTime}/> / <MGTime ms={this.state.duration}/>
        </ToolbarGroup>
        </Toolbar>
      </div>
    }
});

module.exports = MGPlayer;