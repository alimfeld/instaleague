'use strict';

var should = require('should');
var ranking = require('./ranking');

describe('ranking', function() {

  it('should calculate wins', function () {
    var wins = ranking.breakTies(
      [[  , 2, 2], [ 1,  , 0], [ 1, 2,  ]],
      [0, 1, 2],
      [{ fn: 'wins' }]);
    wins.should.eql({
      fn: 'wins',
      direct: false,
      scores: {
        '2': {
          competitors: [0],
          rank: 1
        },
        '1': {
          competitors: [2],
          rank: 2
        },
        '0': {
          competitors: [1],
          rank: 3
        }
      }
    });
  });

  it('should break ties', function () {
    var wins = ranking.breakTies(
      [[  , 2, 1], [ 1,  , 2], [ 2, 0,  ]],
      [0, 1, 2],
      [{ fn: 'wins' },
        { fn: 'goalDifference' }]);
    wins.should.eql({
      fn: 'wins',
      direct: false,
      scores: {
        1: {
          competitors: [0, 1, 2],
          rank: 1,
          tieBreak: {
            fn: 'goalDifference',
            direct: false,
            scores: {
              '0': {
                competitors: [0],
                rank: 2
              },
              '1': {
                competitors: [1],
                rank: 1
              },
              '-1': {
                competitors: [2],
                rank: 3
              }
            }
          }
        }
      }
    });
  });

  it('should break ties recursively', function () {
    var wins = ranking.breakTies(
      [[  , 5, 0], [ 0,  , 2], [ 3, 1,  ]],
      [0, 1, 2],
      [{ fn: 'wins' },
        { fn: 'goalDifference' },
        { fn: 'goals' }]);
    wins.should.eql({
      fn: 'wins',
      direct: false,
      scores: {
        1: {
          competitors: [0, 1, 2],
          rank: 1,
          tieBreak: {
            fn: 'goalDifference',
            direct: false,
            scores: {
              '2': {
                competitors: [0, 2],
                rank: 1,
                tieBreak: {
                  fn: 'goals',
                  direct: false,
                  scores: {
                    '5': {
                      competitors: [0],
                      rank: 1
                    },
                    '4': {
                      competitors: [2],
                      rank: 2
                    }
                  }
                }
              },
              '-4': {
                competitors: [1],
                rank: 3
              }
            }
          }
        }
      }
    });
  });

  it('should break ties recursively with direct true', function () {
    var wins = ranking.breakTies(
      [[  , 5, 0], [ 0,  , 2], [ 3, 1,  ]],
      [0, 1, 2],
      [{ fn: 'wins' },
        { fn: 'goalDifference' },
        { fn: 'wins', direct: true }]);
    wins.should.eql({
      fn: 'wins',
      direct: false,
      scores: {
        1: {
          competitors: [0, 1, 2],
          rank: 1,
          tieBreak: {
            fn: 'goalDifference',
            direct: false,
            scores: {
              '2': {
                competitors: [0, 2],
                rank: 1,
                tieBreak: {
                  fn: 'wins',
                  direct: true,
                  scores: {
                    '0': {
                      competitors: [0],
                      rank: 2
                    },
                    '1': {
                      competitors: [2],
                      rank: 1
                    }
                  }
                }
              },
              '-4': {
                competitors: [1],
                rank: 3
              }
            }
          }
        }
      }
    });
  });

  it('should break ties recursively in lower ranks', function () {
    var wins = ranking.breakTies(
      [[  , 3, 4], [ 0,  , 1], [ 1, 1,  ]],
      [0, 1, 2],
      [{ fn: 'wins' },
        { fn: 'goalDifference' },
        { fn: 'goals' }]);
    wins.should.eql({
      fn: 'wins',
      direct: false,
      scores: {
        2: {
          competitors: [0],
          rank: 1
        },
        0: {
          competitors: [1, 2],
          rank: 2,
          tieBreak: {
            fn: 'goalDifference',
            direct: false,
            scores: {
              '-3': {
                competitors: [1, 2],
                rank: 2,
                tieBreak: {
                  fn: 'goals',
                  direct: false,
                  scores: {
                    '1': {
                      competitors: [1],
                      rank: 3
                    },
                    '2': {
                      competitors: [2],
                      rank: 2
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
  });

  it('should assign expected ranks', function () {
    var ranks = ranking.rank(
      [[  , 2, 2], [ 1,  , 0], [ 1, 2,  ]],
      [0, 1, 2],
      [{ fn: 'wins' }]);
    ranks.should.eql(
      [ {
          competitor: 0, rank: 1, hint: 'wins: 2', tied: 0, points: 1,
          wins: 2, losses: 0, draws: 0, games: 2, plus: 4, minus: 2,
          versus: [{
            opponent: 1,
            wins: 1, losses: 0, draws: 0, games: 1, plus: 2, minus: 1
          }, {
            opponent: 2,
            wins: 1, losses: 0, draws: 0, games: 1, plus: 2, minus: 1
          }]
        },
        { competitor: 1, rank: 3, hint: 'wins: 0', tied: 0, points: 0,
          wins: 0, losses: 2, draws: 0, games: 2, plus: 1, minus: 4,
          versus: [{
            opponent: 0,
            wins: 0, losses: 1, draws: 0, games: 1, plus: 1, minus: 2
          }, {
            opponent: 2,
            wins: 0, losses: 1, draws: 0, games: 1, plus: 0, minus: 2
          }]
        },
        { competitor: 2, rank: 2, hint: 'wins: 1', tied: 0, points: 0.5,
          wins: 1, losses: 1, draws: 0, games: 2, plus: 3, minus: 2,
          versus: [{
            opponent: 0,
            wins: 0, losses: 1, draws: 0, games: 1, plus: 1, minus: 2
          }, {
            opponent: 1,
            wins: 1, losses: 0, draws: 0, games: 1, plus: 2, minus: 0
          }]
        } ]);
  });

  it('should handle undefined results', function () {
    var wins = ranking.breakTies(undefined,
      [0, 1, 2],
      [{ fn: 'wins' }]);
    wins.should.eql({
      fn: 'wins',
      direct: false,
      scores: {
        '0': {
          competitors: [0, 1, 2],
          rank: 1,
          tieBreak: undefined
        }
      }
    });
  });

});
