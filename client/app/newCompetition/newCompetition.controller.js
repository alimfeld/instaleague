'use strict';

angular.module('instaleagueApp')
  .controller('NewcompetitionCtrl', function ($scope, $http, $stateParams, ranking) {

    var init = function() {
      $scope.active = [];
      $scope.results = [];
      $scope.tags = [];
      $scope.scores = [];
      $scope.league.competitors.forEach(function(name, competitor) {
        $scope.active[competitor] = true;
        $scope.results[competitor] = [];
        $scope.tags[competitor] = [];
      });
    };

    var initScore = function(i) {
      $scope.scores[i] = {
        competitor: i,
        games: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        plus: 0,
        minus: 0
      };
    };

    $http.get('/api/leagues/' + $stateParams.league).success(function(league) {
      $scope.league = league;
      init();
    });

    $scope.updateScores = function() {
      $scope.league.competitors.forEach(function(name, competitor) {
        initScore(competitor);
        if (!$scope.active[competitor]) {
          $scope.results[competitor] = [];
          return;
        }
        $scope.results[competitor].forEach(function(plus, opponent) {
          if (!$scope.active[opponent]) {
            $scope.results[competitor][opponent] = undefined;
            return;
          }
          var minus = $scope.results[opponent][competitor];
          if (plus !== undefined && minus !== undefined) {
            var score = $scope.scores[competitor];
            if (plus > minus) {
              score.wins += 1;
            } else if (plus < minus) {
              score.losses += 1;
            } else {
              score.draws += 1;
            }
            score.games += 1;
            score.plus += plus;
            score.minus += minus;
          }
        });
      });
      var ranks = ranking($scope.results,
                          $scope.active.map(function(active, index) {
                            return active ? index : undefined;
                          }).filter(function(competitor) {
                            return competitor !== undefined;
                          }),
                          [{ fn: 'wins', overall: true },
                            { fn: 'goalDifference', overall: true },
                            { fn: 'goals', overall: true },
                            { fn: 'wins', overall: false }]);
      var updateRank = function(ranks, score) {
        var newRanks = ranks.scores[score];
        if (newRanks.tieBreak) {
          updateRanks(newRanks.tieBreak);
        } else {
          newRanks.competitors.forEach(function(competitor) {
            $scope.scores[competitor].hint = (ranks.overall ? 'overall ' : 'direct ') + ranks.fn + ': ' + score;
            $scope.scores[competitor].rank = newRanks.rank;
          });
        }
      };
      var updateRanks = function(ranks) {
        for (var score in ranks.scores) {
          if (ranks.scores.hasOwnProperty(score)) {
            updateRank(ranks, score);
          }
        }
      };
      updateRanks(ranks);
      $scope.scores.sort(function(a, b) {
        return a.rank - b.rank;
      });
    };
  });
