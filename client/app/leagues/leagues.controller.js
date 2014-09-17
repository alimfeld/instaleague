'use strict';

angular.module('instaleagueApp')
  .controller('LeaguesCtrl', function ($scope, $http) {

    var fetchLeagues = function() {
      $http.get('/api/leagues').success(function(leagues) {
        $scope.leagues = leagues;
      });
    };

    fetchLeagues();

    $scope.createLeague = function() {
      if($scope.name === '') {
        return;
      }
      $http.post('/api/leagues', { name: $scope.name });
      $scope.name = '';
      fetchLeagues();
    };
  });
