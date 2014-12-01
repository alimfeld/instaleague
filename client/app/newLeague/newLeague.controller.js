'use strict';

angular.module('instaleagueApp')
  .controller('NewleagueCtrl', function ($scope, $http, $location) {

    $scope.createLeague = function() {
      $http.post('/api/leagues', {
        name: $scope.name,
        competitors: $scope.competitors,
        tags: $scope.tags
      }).success(function() {
        $location.path('');
      });
    };
  });
