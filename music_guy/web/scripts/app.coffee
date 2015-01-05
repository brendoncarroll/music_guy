#= require_directory ./lib

$(document).ready ->

  $songs = $("#songs")
  songTemplate = "<tr><td>{{title}}</td><td>{{album}}</td><td>{{artist}}</td></tr>"

  addSong = (song) ->
    $songs.append Mustache.render(songTemplate, song)
    return

  clearSongs = ->
    $('td').empty()
    console.log('cleared songs.')
    return

  $.ajax
    type: "GET"
    url: "/library/songs"
    success: (data) ->
      $.each data.songs, (i, song) ->
        addSong song
        return
      return
    error: ->
      alert "error"
      return
  return
  
