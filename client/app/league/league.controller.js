'use strict';

angular.module('instaleagueApp')
  .controller('LeagueCtrl', function ($scope, $stateParams, $http) {
    $http.get('/api/leagues/' + $stateParams.leagueId).success(function(league) {
      $scope.league = league;
    });
  });
