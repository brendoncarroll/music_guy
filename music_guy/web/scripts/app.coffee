#= require_directory ./lib

$(document).ready ->

  $songs = $("#songs")
  songTemplate = """
  <tr class="songEntry" id="{{songID}}">
    <td>{{title}}</td>
    <td>{{album}}</td>
    <td>{{artist}}</td>
  </tr>
  """

  addSong = (song) ->
    $songs.append Mustache.render(songTemplate, song)
    return

  clearSongs = ->
    $('#songs .songEntry').remove()
    return

  updateSongs = (songs)->
    clearSongs()
    addSong song for song in songs

  $('#searchbox').keydown (e) ->
    if e.keyCode is 13
      e.preventDefault()
    $.ajax
      type: 'GET'
      data:
        q: $('#searchbox').val()
      url: '/library/search'
      success: (data) ->
        updateSongs data.results
        return
      error: ->
        alert: 'search error'
        return

  $.ajax
    type: "GET"
    url: "/library/songs"
    success: (data) ->
      updateSongs data.songs
      return
    error: ->
      alert "error"
      return
  return
  
