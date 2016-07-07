'use strict';

juke.factory('SongFactory', function (){

  var songObj = {};


  songObj.prepareSong = function(song){
    song.audioUrl = '/api/songs/' + song.id + '/audio';
  };


  return songObj;

});
