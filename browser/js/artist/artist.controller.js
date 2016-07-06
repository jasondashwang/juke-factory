'use strict';

juke.controller('ArtistsCtrl', function($scope, $rootScope, ArtistFactory) {

  $scope.showArtists = false;

  ArtistFactory.fetchAll()
  .then(function(response){
    $scope.artists = response.data;
  });

  $rootScope.$on('showAllArtists', function(event){
    $scope.showArtists = true;
  });

  $rootScope.$on('closeAll', function(event){
    $scope.showArtists = false;
  });

  $scope.showSpecificArtist = function(artistId){
    $rootScope.$broadcast('closeAll');
    $rootScope.$broadcast('showSpecificArtist', {id: artistId});
  };


});

juke.controller('ArtistCtrl', function($scope, $log,$rootScope, ArtistFactory, PlayerFactory) {

  $scope.toggle = function (song) {
    if(PlayerFactory.isPlaying() && song === PlayerFactory.getCurrentSong()){
      PlayerFactory.pause();
    } else {
      PlayerFactory.start(song, $scope.songs);
    }
  };

  $scope.getCurrentSong = function(){
    return PlayerFactory.getCurrentSong();
  };

  $scope.isPlaying = function(){
    return PlayerFactory.isPlaying();
  };


  $scope.showArtist = false;

  $rootScope.$on('showSpecificArtist', function(event, obj){
    $scope.showArtist = true;
    ArtistFactory.fetchById(obj.id)
    .then(function(response){
      $scope.artist = response.data;
      return ArtistFactory.fetchSongsById(obj.id);
    })
    .then(function(response){
      $scope.songs = [];
      response.data.forEach(function(song){
        song.audioUrl = '/api/songs/' + song.id + '/audio';
        $scope.songs.push(song);
      });
      return ArtistFactory.fetchAlbumsById(obj.id);
    })
    .then(function(response){
      var albums = response.data;
      $scope.albums = [];
      albums.forEach(function(album){
        var specificAlbum = album;
        specificAlbum.imageUrl = '/api/albums/' + specificAlbum.id + '/image';
        $scope.albums.push(specificAlbum);
      });
    })
    .catch($log.error);
  });


});
