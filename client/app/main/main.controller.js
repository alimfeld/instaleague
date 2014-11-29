'use strict';

angular.module('instaleagueApp').controller('MainCtrl', function ($scope, leagues) {

  leagues.data.sort(function(a, b) {
    return a.updated < b.updated;
  });
  $scope.leagues = leagues.data;

});
