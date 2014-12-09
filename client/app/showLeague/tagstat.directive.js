'use strict';
angular.module('instaleagueApp').directive('tagstat', function () {
  return {
    restrict: 'E',
    scope: {
      stat: '=',
      tag: '='
    },
    link: function(scope) {
      scope.count = scope.stat.tags[scope.tag] || 0;
      scope.competitions = scope.stat.competitions || 0;
      if (scope.competitions) {
        scope.percentage = scope.count / scope.competitions * 100;
      } else {
        scope.percentage = 0;
      }
    },
    templateUrl: 'app/showLeague/tagstat.html'
  };
});
