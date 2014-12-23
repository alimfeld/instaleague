'use strict';

angular.module('instaleagueApp').controller('ShowLeagueCtrl',
  function ($scope, $http, $location, $stateParams, _, Auth, league) {

  // "lazy" load competitions
  $http.get('/api/leagues/' + $stateParams.league + '/competitions').success(function(competitions) {
    competitions.sort(function(a, b) {
      return new Date(b.date) - new Date(a.date);
    });
    $scope.competitions = competitions;
  });

  league.data.stats.sort(function(a, b) {
    return b.points - a.points;
  });
  league.data.stats.forEach(function(stat) {
    stat.indexedVersus =  _.indexBy(stat.versus, 'opponent');
  });
  $scope.league = league.data;

  $scope.me = Auth.getCurrentUser()._id;

  $scope.newCompetition = function() {
    var date = new Date();
    date.setSeconds(0);
    date.setMilliseconds(0);
    $http.post('/api/competitions', {
      date: date,
      league: {
        id: $scope.league._id
      },
      competitors: _.range($scope.league.competitors.length)
    }).success(function(competition) {
      $location.path('/leagues/' + $scope.league._id + '/competitions/' + competition._id);
    });
  };
});
