'use strict';

angular.module('instaleagueApp')
  .controller('NewcompetitionCtrl', function ($scope, $http, $stateParams) {
    $http.get('/api/leagues/' + $stateParams.league).success(function(league) {
      $scope.league = league;
    });
  });
