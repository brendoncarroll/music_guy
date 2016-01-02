
var SongStore = require('../stores/SongStore');
var $ = require('jquery');

var MGDispatcher = require('../dispatchers/MGDispatcher.js');

module.exports = {
    random: function (limit) {
        $.getJSON('library/songs', function (data) {
            MGDispatcher.dispatch({
                actionType: 'SEARCH_RESULTS',
                results: data.results
            });
        })
    },
    search : function (query) {
        var param = $.param({
            q: query
        });
        $.getJSON('library/search?' + param, function (data) {
            MGDispatcher.dispatch({
                actionType: 'SEARCH_RESULTS',
                results: data.results
            });
        });

    },
};