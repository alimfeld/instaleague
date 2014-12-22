'use strict';

angular.module('instaleagueApp').controller('ShowLeagueCtrl',
  function ($scope, $http, $location, _, Auth, league, competitions) {

  league.data.stats.sort(function(a, b) {
    return b.points - a.points;
  });
  league.data.stats.forEach(function(stat) {
    stat.indexedVersus =  _.indexBy(stat.versus, 'opponent');
  });
  $scope.league = league.data;

  competitions.data.sort(function(a, b) {
    return new Date(b.date) - new Date(a.date);
  });
  $scope.competitions = competitions.data;

  $scope.me = Auth.getCurrentUser()._id;

  $scope.newCompetition = function() {
    $http.post('/api/competitions', {
      date: new Date(),
      league: {
        id: $scope.league._id
      },
      competitors: _.range($scope.league.competitors.length)
    }).success(function(competition) {
      $location.path('/leagues/' + $scope.league._id + '/competitions/' + competition._id);
    });
  };
});
