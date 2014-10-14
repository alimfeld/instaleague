'use strict';

angular.module('instaleagueApp')
.controller('ShowCompetitionCtrl', function ($scope, $http, $stateParams) {

  $http.get('/api/competitions/' + $stateParams.competition).success(function(competition) {
    $scope.competition = competition;
    $http.get('/api/leagues/' + competition.league).success(function(league) {
      $scope.league = league;
    });
  });

  $scope.$watch('competition', function(competition) {
    if (competition) {
      competition.stats.sort(function(a, b) {
        return a.rank - b.rank;
      });
    }
  });

});
