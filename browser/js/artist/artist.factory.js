'use strict';

juke.factory('ArtistFactory', function ($http){

  var artistObj = {};

  artistObj.fetchAll = function() {
    return $http.get('/api/artists');
  };

  artistObj.fetchById = function(id){
    return $http.get('/api/artists/' + id);
  };

  artistObj.fetchAlbumsById = function(id){
    return $http.get('/api/artists/' + id + '/albums');
  };

  artistObj.fetchSongsById = function(id){
    return $http.get('/api/artists/' + id + '/songs');
  };

  return artistObj;

});
