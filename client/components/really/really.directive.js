'use strict';
angular.module('instaleagueApp').directive('reallyClick', function ($window) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.bind('click', function() {
        var message = attrs.reallyMessage;
        if (message && $window.confirm(message)) {
          scope.$apply(attrs.reallyClick);
        }
      });
    }
  };
});
