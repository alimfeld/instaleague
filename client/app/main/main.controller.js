'use strict';

angular.module('instaleagueApp').controller('MainCtrl', function ($scope, Auth, leagues, competitions) {

  leagues.data.sort(function(a, b) {
    return new Date(b.updated) - new Date(a.updated);
  });
  $scope.leagues = leagues.data;

  competitions.data.sort(function(a, b) {
    return new Date(a.date) - new Date(b.date);
  });
  $scope.competitions = competitions.data;

  $scope.me = Auth.getCurrentUser()._id;

});
