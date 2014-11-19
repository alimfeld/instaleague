'use strict';

angular.module('instaleagueApp').controller('MainCtrl', function ($scope, $http) {

  $scope.leagues = [];

  $http.get('/api/leagues').success(function(leagues) {
    leagues.sort(function(a, b) {
      return a.updated < b.updated;
    });
    $scope.leagues = leagues;
  });
});
