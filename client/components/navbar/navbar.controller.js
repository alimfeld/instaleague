'use strict';

angular.module('instaleagueApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {

    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isLocalUser = function() {
      var user = Auth.getCurrentUser();
      return user && user.provider === 'local';
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
