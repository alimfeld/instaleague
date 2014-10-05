'use strict';

angular.module('instaleagueApp')
  .factory('ranking', function () {

    var allTieBreakers = {};

    var aggregate = function(results, competitors, competitor, direct, callback) {
      results[competitor].forEach(function(plus, opponent) {
        if (competitor === opponent) {
          return;
        }
        if (!direct || (competitors.indexOf(opponent) >= 0)) {
          var minus = results[opponent][competitor];
          if (plus !== undefined && minus !== undefined) {
            callback(plus, minus);
          }
        }
      });
    };

    allTieBreakers.wins = function(results, competitors, direct) {
      var wins = [];
      competitors.forEach(function(competitor) {
        wins[competitor] = 0;
        aggregate(results, competitors, competitor, direct, function(plus, minus) {
          if (plus > minus) {
            wins[competitor] += 1;
          }
        });
      });
      return wins;
    };

    allTieBreakers.goalDifference = function(results, competitors, direct) {
      var diff = [];
      competitors.forEach(function(competitor) {
        var plusCount = 0;
        var minusCount = 0;
        aggregate(results, competitors, competitor, direct, function(plus, minus) {
          plusCount += plus;
          minusCount += minus;
        });
        diff[competitor] = plusCount - minusCount;
      });
      return diff;
    };

    allTieBreakers.goals = function(results, competitors, direct) {
      var goals = [];
      competitors.forEach(function(competitor) {
        goals[competitor] = 0;
        aggregate(results, competitors, competitor, direct, function(plus) {
          goals[competitor] += plus;
        });
      });
      return goals;
    };

    var breakTies = function(results, competitors, tieBreakers, rankOffset) {
      var tieBreak;
      var tieBreaker = tieBreakers[0];
      if (tieBreaker) {
        tieBreak = {
          fn: tieBreaker.fn,
          direct: tieBreaker.direct || false,
          scores: {}
        };
        var scores = allTieBreakers[tieBreaker.fn](results, competitors, tieBreaker.direct);
        var sortedScores = scores.slice().sort(function(a, b) {
          return b - a;
        });
        scores.forEach(function(score, competitor) {
          var entry = tieBreak.scores[score];
          if (entry) {
            entry.competitors.push(competitor);
          } else {
            tieBreak.scores[score] = {
              competitors: [competitor],
              rank: sortedScores.indexOf(score) + (rankOffset || 0) + 1
            };
          }
        });
        for (var score in tieBreak.scores) {
          if (tieBreak.scores.hasOwnProperty(score)) {
            var tiedCompetitors = tieBreak.scores[score].competitors;
            if (tiedCompetitors.length > 1) {
              var rank = tieBreak.scores[score].rank;
              tieBreak.scores[score].tieBreak = breakTies(results, tiedCompetitors, tieBreakers.slice(1), rank - 1);
            }
          }
        }
      }
      return tieBreak;
    };

    return breakTies;
  });
