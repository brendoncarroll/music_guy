#= require_directory ./lib

$(document).ready ->

  $songs = $("#songs")
  $player = $('#player')
  songTemplate = """
  <tr class="songEntry" id="song{{songID}}">
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
    return

  playerInfo = (song) ->
    $player.append song.title
    return

  getInfo = (songID) ->
    $.ajax
      type: 'GET'
      url: '/library/songs/' + songID.slice(4)
      success: (data) ->
        playerInfo data
        return
      error: ->
        alert 'Error getting song'
        return


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

  $songs.delegate '.songEntry', 'click', ->
    getInfo $(this).attr('id')
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
  
