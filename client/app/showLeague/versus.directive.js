'use strict';
angular.module('instaleagueApp').directive('versus', function () {
  return {
    restrict: 'E',
    scope: {
      result: '='
    },
    link: function(scope) {
      if (scope.result) {
        scope.percentage = (scope.result.wins + scope.result.draws / 2) / scope.result.games;
      }
    },
    templateUrl: 'app/showLeague/versus.html'
  };
});
