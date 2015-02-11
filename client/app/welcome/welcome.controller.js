'use strict';

angular.module('instaleagueApp')
  .controller('WelcomeCtrl', function ($scope, $http) {
    $scope.leagues = {};
    $scope.$watch('search', function(value) {
      if (value && value.length >= 3) {
        $http({
          url: '/api/leagues',
          method: 'GET',
          params: {name: value}
        }).success(function(leagues) {
          $scope.leagues = leagues;
        });
      } else {
        $scope.leagues = {};
      }
    });
  });
