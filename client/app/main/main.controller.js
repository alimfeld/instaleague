'use strict';

angular.module('instaleagueApp')
  .controller('MainCtrl', function ($scope, $http, $window,  Auth) {

    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.league = undefined;
    $scope.leagues = [];

    if (Auth.isLoggedIn()) {
      $http.get('/api/leagues').success(function(leagues) {
        leagues.sort(function(a, b) {
          return a.updated < b.updated;
        });
        $scope.leagues = leagues;
        $scope.league = leagues[0];
      });
    }

    $scope.$watch('league', function(league) {
      if (!league) {
        $scope.stats = undefined;
      } else {
        var stats = [];
        league.competitors.forEach(function(competitor, i) {
          var stat = league.stats[i] || { points: 0 };
          stat.competitor = competitor;
          stats[i] = stat;
        });
        stats.sort(function(a, b) {
          return b.points - a.points;
        });
        $scope.stats = stats;
      }
    });

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
