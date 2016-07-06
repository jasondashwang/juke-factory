'use strict';

juke.factory('PlayerFactory', function($rootScope){
  // non-UI logic in here

  var player = {};

  player.audio = document.createElement('audio');
  player.song = null;
  player.songList = null;
  player.progress = 0;

  // Audio Event Listeners

  player.audio.addEventListener('ended', function () {
    player.next();
    // $scope.$apply(); // triggers $rootScope.$digest, which hits other scopes
    $rootScope.$evalAsync(); // likely best, schedules digest if none happening
  });

  player.audio.addEventListener('timeupdate', function () {
    player.progress = player.audio.currentTime / player.audio.duration
    $rootScope.$evalAsync(); // likely best, schedules digest if none happening
  });


  player.start = function (song, songList) {
    player.song = song;

    if(songList){
      var newSongList = [];
      for (var i = 0; i < songList.length; i++) {
        if(songList[i].audioUrl === song.audioUrl){
          newSongList = songList.slice(i).concat(newSongList);
          break;
        } else {
          newSongList.push(songList[i]);
        }
      }
      player.songList = newSongList;
    }

    player.pause();
    player.audio.src = song.audioUrl;
    player.audio.load();
    player.audio.play();
  };

  player.pause = function () {
    player.audio.pause();
  }

  player.resume = function () {
    player.audio.play();
  }

  player.isPlaying = function () {
    return player.audio.paused ? false : true;
  }

  player.getCurrentSong = function () {
    return player.song;
  }

  player.next = function () {
    player.songList.push(player.songList.shift());
    player.start(player.songList[0]);
  }

  player.previous = function () {
    player.songList.unshift(player.songList.pop());
    player.start(player.songList[0]);
  }

  player.getProgress = function () {
    return player.progress;
  }

  return player;

});
