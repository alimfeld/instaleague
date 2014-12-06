'use strict';
angular.module('instaleagueApp').directive('hint', function () {
  return {
    restrict: 'E',
    scope: {
      text: '@'
    },
    template: '<i class="fa fa-info-circle" tooltip="{{ text }}"></i>'
  };
});
