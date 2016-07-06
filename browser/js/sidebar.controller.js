'use strict';

juke.controller('SidebarCtrl', function ($scope, $rootScope) {

  $scope.showAllAlbums = function(){
    $rootScope.$broadcast('closeAll');
    $rootScope.$broadcast('showAllAlbums');
  };

  $scope.viewAllArtists = function(){
    $rootScope.$broadcast('closeAll');
    $rootScope.$broadcast('showAllArtists');
  };

});
