'use strict';
angular.module('instaleagueApp').directive('tagstat', function () {
  return {
    restrict: 'E',
    scope: {
      stat: '=',
      tag: '='
    },
    link: function(scope) {
      if (scope.stat.tags[scope.tag] && scope.stat.competitions) {
        scope.percentage = scope.stat.tags[scope.tag] / scope.stat.competitions * 100;
      } else {
        scope.percentage = 0;
      }
    },
    templateUrl: 'app/showLeague/tagstat.html'
  };
});
