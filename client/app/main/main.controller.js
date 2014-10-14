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
