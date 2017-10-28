/**
 * NOTE forked from https://codepen.io/markhillard/details/Hjcwu#forks
 */

// CONFIG

var randomize = true;
var autoplay = true;

//--------------

Array.prototype.shuffle = function() {
  var input = this;
  for (var i = input.length-1; i >=0; i--) {
    var randomIndex = Math.floor(Math.random()*(i+1));
    var itemAtIndex = input[randomIndex];
    input[randomIndex] = input[i];
    input[i] = itemAtIndex;
  }
  return input;
}


jQuery(function($) {
  'use strict';
  var supportsAudio = !! document.createElement('audio').canPlayType;
  if (supportsAudio) {
    var keys = [];
    for (var key in PLAYLIST)
      keys.push(key);

    if (randomize)
      keys = keys.shuffle();

    var tracks = [];
    for (var i = 0; i < keys.length; i++) {
      tracks = tracks.concat(PLAYLIST[keys[i]]);
    }

    var index = 0,
      playing = false,
      buildPlaylist = $.each(tracks, function(key, value) {
        var trackNumber = key,
          trackName = value.name,
          trackLength = value.length;
        if (trackNumber.toString().length === 1) {
          trackNumber = '0' + trackNumber;
        } else {
          trackNumber = '' + trackNumber;
        }
        $('#plList').append('<li><div class="plItem"><div class="plNum">' + trackNumber + '.</div><div class="plTitle">' + trackName + '</div><div class="plLength">' + trackLength + '</div></div></li>');
      }),
      trackCount = tracks.length,
      npAction = $('#npAction'),
      npTitle = $('#npTitle'),
      audio = $('#audio1').bind('play', function() {
        playing = true;
        npAction.text('Now Playing...');
      }).bind('pause', function() {
        playing = false;
        npAction.text('Paused...');
      }).bind('ended', function() {
        npAction.text('Paused...');
        if ((index + 1) < trackCount) {
          index++;
          loadTrack(index);
          audio.play();
        } else {
          audio.pause();
          index = 0;
          loadTrack(index);
        }
      }).get(0),
      btnPrev = $('#btnPrev').click(function() {
        if ((index - 1) > -1) {
          index--;
          loadTrack(index);
          if (playing) {
            audio.play();
          }
        } else {
          audio.pause();
          index = 0;
          loadTrack(index);
        }
      }),
      btnNext = $('#btnNext').click(function() {
        if ((index + 1) < trackCount) {
          index++;
          loadTrack(index);
          if (playing) {
            audio.play();
          }
        } else {
          audio.pause();
          index = 0;
          loadTrack(index);
        }
      }),
      li = $('#plList li').click(function() {
        var id = parseInt($(this).index());
        if (id !== index) {
          playTrack(id);
        }
      }),
      loadTrack = function(id) {
        $('.plSel').removeClass('plSel');
        $('#plList li:eq(' + id + ')').addClass('plSel');
        npTitle.text(tracks[id].name);
        index = id;
        audio.src = tracks[id].file;
      },
      playTrack = function(id) {
        loadTrack(id);
        audio.play();
      };

    if (autoplay) {
      playTrack(index);
    } else {
      loadTrack(index);
    }
  }
});

//initialize plyr
plyr.setup($('#audio1'), {});
