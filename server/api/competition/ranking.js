'use strict';

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

var stats = function(results, competitors) {
  var result = [];
  competitors.forEach(function(competitor) {
    result[competitor] = {
      competitor: competitor,
      games: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      plus: 0,
      minus: 0,
      versus: []
    };
    competitors.forEach(function(opponent) {
      if (competitor !== opponent) {
        var plus = results[competitor][opponent] || 0;
        var minus = results[opponent][competitor] || 0;
        var entry = result[competitor];
        var versus = {
          opponent: opponent,
          games: 1,
          wins: 0,
          losses: 0,
          draws: 0,
          plus: plus,
          minus: minus
        };
        if (plus > minus) {
          entry.wins += 1;
          versus.wins = 1;
        } else if (plus < minus) {
          entry.losses += 1;
          versus.losses = 1;
        } else {
          entry.draws += 1;
          versus.draws = 1;
        }
        entry.games += 1;
        entry.plus += plus;
        entry.minus += minus;
        entry.versus.push(versus);
      }
    });
  });
  return result;
};

var rank = function(results, competitors, tieBreakers) {

  var ranks = breakTies(results, competitors, tieBreakers);

  var result = stats(results, competitors);

  var visitRank = function(ranks, score) {
    var newRanks = ranks.scores[score];
    if (newRanks.tieBreak) {
      visitRanks(newRanks.tieBreak);
    } else {
      var hint = (ranks.direct ? 'direct ' : '') + ranks.fn + ': ' + score;
      var rank = newRanks.rank;
      var tied = newRanks.competitors.length - 1;
      var points = 1 - (rank - 1 + tied / 2) / (competitors.length - 1)
      newRanks.competitors.forEach(function(competitor) {
        var entry = result[competitor];
        entry.rank = rank;
        entry.tied = tied;
        entry.hint = hint;
        entry.points = points;
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

  return result;
};

module.exports = { rank: rank, breakTies: breakTies };
