'use strict';

angular.module('instaleagueApp')
  .controller('NewleagueCtrl', function ($scope, $http, $location) {

    $scope.createLeague = function() {
      $http.post('/api/leagues', {
        name: $scope.name,
        path: $scope.path,
        competitors: $scope.competitors,
        tags: $scope.tags
      });
      $location.path('');
    };
  });
