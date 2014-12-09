'use strict';
angular.module('instaleagueApp').directive('tagstat', function () {
  return {
    restrict: 'E',
    scope: {
      stat: '=',
      tag: '='
    },
    link: function(scope) {
      scope.percentage = scope.stat.tags[scope.tag] / scope.stat.competitions * 100;
    },
    templateUrl: 'app/showLeague/tagstat.html'
  };
});
