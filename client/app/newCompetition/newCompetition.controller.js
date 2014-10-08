'use strict';

angular.module('instaleagueApp')
  .controller('NewcompetitionCtrl', function ($scope, $http, $stateParams, $location, ranking) {

    var initScope = function() {
      $scope.date = new Date();
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
        minus: 0,
        rank: 0,
        tied: undefined,
        hint: undefined,
        points: undefined
      };
    };

    $http.get('/api/leagues/' + $stateParams.league).success(function(league) {
      $scope.league = league;
      initScope();
    });

    var cleanupResults = function() {
      $scope.league.competitors.forEach(function(name, competitor) {
        if (!$scope.active[competitor]) {
          $scope.results[competitor] = [];
        }
        $scope.results[competitor].forEach(function(plus, opponent) {
          if (!$scope.active[opponent]) {
            $scope.results[competitor][opponent] = undefined;
          }
        });
      });
    };

    var updateScoreStats = function() {
      $scope.league.competitors.forEach(function(name, competitor) {
        initScore(competitor);
        if (!$scope.active[competitor]) {
          return;
        }
        $scope.results[competitor].forEach(function(plus, opponent) {
          if (!$scope.active[opponent]) {
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
    };

    var updateScoreRanks = function() {
      var ranks = ranking($scope.results,
                          $scope.active.map(function(active, index) {
                            return active ? index : undefined;
                          }).filter(function(competitor) {
                            return competitor !== undefined;
                          }),
                          [{ fn: 'wins' },
                           { fn: 'goalDifference' },
                           { fn: 'goals' },
                           { fn: 'wins', direct: true }]);
      var visitRank = function(ranks, score) {
        var newRanks = ranks.scores[score];
        if (newRanks.tieBreak) {
          visitRanks(newRanks.tieBreak);
        } else {
          newRanks.competitors.forEach(function(competitor) {
            $scope.scores[competitor].hint = (ranks.direct ? 'direct ' : '') + ranks.fn + ': ' + score;
            $scope.scores[competitor].rank = newRanks.rank;
            $scope.scores[competitor].tied = newRanks.competitors.length - 1;
          });
        }
      };
      var visitRanks = function(ranks) {
        for (var score in ranks.scores) {
          if (ranks.scores.hasOwnProperty(score)) {
            visitRank(ranks, score);
          }
        }
      };
      visitRanks(ranks);
    };

    var updateScorePoints = function() {
      var nofCompetitors = $scope.active.reduce(function(prev, active) {
        return active ? prev + 1 : prev;
      }, 0);
      $scope.scores.forEach(function(score) {
        if (score.rank) {
          score.points = 1 - (score.rank - 1 + score.tied / 2) / (nofCompetitors - 1);
        }
      });
    }

    $scope.isTagSelected = function(competitor, tag) {
      return $scope.tags[competitor].indexOf(tag) > -1;
    };

    $scope.toggleTagSelection = function(competitor, tag) {
      var tags = $scope.tags[competitor];
      var idx = tags.indexOf(tag);
      if (idx > -1) {
        tags.splice(idx, 1);
      } else {
        tags.push(tag);
      }
      console.log(tags);
    };

    $scope.updateScores = function() {
      cleanupResults();
      updateScoreStats();
      updateScoreRanks();
      updateScorePoints();
      $scope.scores.sort(function(a, b) {
        return a.rank - b.rank;
      });
    };

    $scope.save = function() {
      $http.post('/api/competitions', {
        date: $scope.date,
        league: $scope.league._id,
        data: $scope.scores.map(function(entry) {
          entry.active = $scope.active[entry.competitor];
          entry.tags = $scope.tags[entry.competitor];
          entry.results = $scope.results[entry.competitor];
          return entry;
        })
      }).success(function() {
        $location.path('');
      });
    };
  });
