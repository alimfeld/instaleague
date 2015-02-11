'use strict';

angular.module('instaleagueApp')
  .controller('LoginCtrl', function ($scope, $window) {
    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
