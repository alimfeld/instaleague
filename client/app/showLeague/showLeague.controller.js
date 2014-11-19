'use strict';

angular.module('instaleagueApp').controller('ShowLeagueCtrl', function ($scope, $http, $stateParams, _, Auth) {
  $http.get('/api/leagues/' + $stateParams.league).success(function(league) {
    league.stats.sort(function(a, b) {
      return b.points - a.points;
    });
    league.stats.forEach(function(stat) {
      stat.indexedVersus =  _.indexBy(stat.versus, 'opponent');
    });
    $scope.league = league;
    $scope.canManage = Auth.getCurrentUser()._id === league.owner;
  });
});
