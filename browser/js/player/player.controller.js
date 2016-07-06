'use strict';

juke.controller('PlayerCtrl', function ($scope, $rootScope, PlayerFactory) {

  // state
  $scope.currentSong;
  $scope.playing = false;

  // main toggle
  $scope.toggle = function () {
    if (PlayerFactory.isPlaying()) PlayerFactory.pause();
    else PlayerFactory.resume();
  };

  // incoming events (from Album or toggle)

  $scope.isPlaying = function(){
    return PlayerFactory.isPlaying();
  };

  $scope.getCurrentSong = function () {
    return PlayerFactory.getCurrentSong();
  };

  $scope.prev = function () {
    PlayerFactory.previous();
  };

  $scope.next = function () {
    PlayerFactory.next();
  };

  $scope.getCurrentProgress = function() {
    return 100 * PlayerFactory.getProgress();
  }

  // outgoing events (to Album… or potentially other characters)

  function seek (decimal) {
    PlayerFactory.audio.currentTime = PlayerFactory.audio.duration * decimal;
  }

  $scope.handleProgressClick = function (evt) {
    seek(evt.offsetX / evt.currentTarget.scrollWidth);
  };

});
