'use strict';

angular.module('instaleagueApp')
  .controller('MainCtrl', function ($scope, $http, $window,  Auth) {

    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.leagues = [];

    if (Auth.isLoggedIn()) {
      $http.get('/api/leagues').success(function(leagues) {
        $scope.leagues = leagues;
      });
    }

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
