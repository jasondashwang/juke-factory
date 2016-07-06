'use strict';


juke.factory('StatsFactory', function ($q) {
  var statsObj = {};
  statsObj.totalTime = function (album) {
    var audio = document.createElement('audio');
    return $q(function (resolve, reject) {
      var sum = 0;
      var n = 0;
      function resolveOrRecur () {
        if (n >= album.songs.length) resolve(sum);
        else audio.src = album.songs[n++].audioUrl;
      }
      audio.addEventListener('loadedmetadata', function () {
        sum += audio.duration;
        resolveOrRecur();
      });
      resolveOrRecur();
    });
  };
  return statsObj;
});

juke.factory('AlbumFactory', function($http){
  var albumsObj = {};

  albumsObj.fetchAll = function(){
    return $http.get('/api/albums');
  };

  albumsObj.fetchById = function(id){
    return $http.get('/api/albums/' + id);
  };

  return albumsObj;
})


juke.controller('AlbumCtrl', function ($scope, $rootScope, $log, StatsFactory, AlbumFactory) {

  AlbumFactory.fetchAll()
  .then(function(response){
    return AlbumFactory.fetchById(response.data[0].id);
  })
  .then(function(response){
    $scope.album = response.data;
    $scope.album.imageUrl = '/api/albums/' + $scope.album.id + '/image';
    $scope.album.songs.forEach(function (song, i) {
      song.audioUrl = '/api/songs/' + song.id + '/audio';
      song.albumIndex = i;
    });
    return StatsFactory.totalTime($scope.album);
  })
  .then(function(albumDuration){
    $scope.fullDuration = Math.floor(albumDuration / 60);
  })
  .catch($log.error); // $log service can be turned on and off; also, pre-bound

  // main toggle
  $scope.toggle = function (song) {
    if ($scope.playing && song === $scope.currentSong) {
      $rootScope.$broadcast('pause');
    } else $rootScope.$broadcast('play', song);
  };

  // incoming events (from Player, toggle, or skip)
  $scope.$on('pause', pause);
  $scope.$on('play', play);
  $scope.$on('next', next);
  $scope.$on('prev', prev);

  // functionality
  function pause () {
    $scope.playing = false;
  }
  function play (event, song) {
    $scope.playing = true;
    $scope.currentSong = song;
  }

  // a "true" modulo that wraps negative to the top of the range
  function mod (num, m) { return ((num % m) + m) % m; }

  // jump `interval` spots in album (negative to go back, default +1)
  function skip (interval) {
    if (!$scope.currentSong) return;
    var index = $scope.currentSong.albumIndex;
    index = mod( (index + (interval || 1)), $scope.album.songs.length );
    $scope.currentSong = $scope.album.songs[index];
    if ($scope.playing) $rootScope.$broadcast('play', $scope.currentSong);
  }
  function next () { skip(1); }
  function prev () { skip(-1); }

});


juke.controller('AlbumsCtrl', function($scope, $log, AlbumFactory, StatsFactory){
  var untouchedAlbums;
  $scope.albums;

  AlbumFactory.fetchAll()
  .then(function(response){
    untouchedAlbums = response.data;
    var albumPromises = [];

    untouchedAlbums.forEach(function(album){
      albumPromises.push(AlbumFactory.fetchById(album.id));
    });

    return Promise.all(albumPromises);
  })
  .then(function(albums){
    $scope.albums = [];
    albums.forEach(function(album){
      var specificAlbum = album.data;
      specificAlbum.imageUrl = '/api/albums/' + specificAlbum.id + '/image';
      $scope.albums.push(specificAlbum);
    });


    console.log($scope.albums);
  })
  .catch($log.error);

});
