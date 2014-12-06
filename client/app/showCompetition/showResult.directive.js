'use strict';
angular.module('instaleagueApp').directive('result', function ($modal, _) {

  var result = function(competition, competitor, opponent, result) {
    if (_.isNumber(result)) {
      if (!_.isArray(competition.results[competitor])) {
        competition.results[competitor] = [];
      }
      competition.results[competitor][opponent] = result;
    } else {
      if (competition.results[competitor]) {
        return competition.results[competitor][opponent];
      } else {
        return undefined;
      }
    }
  };

  var editResult = function(scope) {
    return function() {
      var modalInstance = $modal.open({
        templateUrl: 'app/showCompetition/editResult.html',
        controller: 'EditResultCtrl',
        size: 'lg',
        resolve: {
          entry: function() {
            return {
              competitorName: scope.league.competitors[scope.competitor],
              opponentName: scope.league.competitors[scope.opponent],
              plus: scope.plus,
              minus: scope.minus
            };
          }
        }
      });

      modalInstance.result.then(function(entry) {
        result(scope.competition, scope.competitor, scope.opponent, entry.plus);
        result(scope.competition, scope.opponent, scope.competitor, entry.minus);
      });
    };
  };


  return {
    restrict: 'E',
    scope: {
      league: '=',
      competition: '=',
      competitor: '=',
      opponent: '='
    },
    link: function(scope) {
      scope.editResult = editResult(scope);
      scope.$watch('competition.results', function() {
        scope.plus = result(scope.competition, scope.competitor, scope.opponent);
        scope.minus = result(scope.competition, scope.opponent, scope.competitor);
        scope.hasResult = _.isNumber(scope.plus) && _.isNumber(scope.minus);
      }, true);
    },
    templateUrl: 'app/showCompetition/showResult.html'
  };
});
