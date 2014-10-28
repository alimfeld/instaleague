'use strict';

angular.module('instaleagueApp')
  .controller('MainCtrl', function ($scope, $http, $window, Auth) {

    $scope.league = undefined;
    $scope.leagues = [];

    Auth.isLoggedInAsync(function(loggedIn) {
      if (loggedIn) {
        $http.get('/api/leagues').success(function(leagues) {
          leagues.sort(function(a, b) {
            return a.updated < b.updated;
          });
          $scope.leagues = leagues;
          $scope.league = leagues[0];
        });
      }
      $scope.loggedIn = loggedIn;
      $scope.ready = true;
    });

    $scope.$watch('league', function(league) {
      if (league) {
        league.stats.sort(function(a, b) {
          return b.points - a.points;
        });
      }
    });

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
