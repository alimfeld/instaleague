'use strict';

describe('Service: New Competition Ranking', function () {

  var ranking;

  beforeEach(module('instaleagueApp'));

  beforeEach(function() {
    inject(function($injector) {
      ranking = $injector.get('ranking');
    });
  });

  it('should calculate wins', function () {
    var wins = ranking([[  , 2, 2], [ 1,  , 0], [ 1, 2,  ]],
                       [0, 1, 2],
                       [{ fn: 'wins', overall: true }]);
    expect(wins).toEqual({
      fn: 'wins',
      overall: true,
      scores: {
        '2': {
          competitors: [0],
          rank: 0
        },
        '1': {
          competitors: [2],
          rank: 1
        },
        '0': {
          competitors: [1],
          rank: 2
        }
      }
    });
  });

  it('should break ties', function () {
    var wins = ranking([[  , 2, 1], [ 1,  , 2], [ 2, 0,  ]],
                       [0, 1, 2],
                       [{ fn: 'wins', overall: true },
                        { fn: 'goalDifference', overall: true }]);
    expect(wins).toEqual({
      fn: 'wins',
      overall: true,
      scores: {
        1: {
          competitors: [0, 1, 2],
          rank: 0,
          tieBreak: {
            fn: 'goalDifference',
            overall: true,
            scores: {
              '0': {
                competitors: [0],
                rank: 1
              },
              '1': {
                competitors: [1],
                rank: 0
              },
              '-1': {
                competitors: [2],
                rank: 2
              }
            }
          }
        }
      }
    });
  });

  it('should break ties recursively', function () {
    var wins = ranking([[  , 5, 0], [ 0,  , 2], [ 3, 1,  ]],
                       [0, 1, 2],
                       [{ fn: 'wins', overall: true },
                        { fn: 'goalDifference', overall: true },
                        { fn: 'goals', overall: true }]);
    expect(wins).toEqual({
      fn: 'wins',
      overall: true,
      scores: {
        1: {
          competitors: [0, 1, 2],
          rank: 0,
          tieBreak: {
            fn: 'goalDifference',
            overall: true,
            scores: {
              '2': {
                competitors: [0, 2],
                rank: 0,
                tieBreak: {
                  fn: 'goals',
                  overall: true,
                  scores: {
                    '5': {
                      competitors: [0],
                      rank: 0
                    },
                    '4': {
                      competitors: [2],
                      rank: 1
                    }
                  }
                }
              },
              '-4': {
                competitors: [1],
                rank: 2
              }
            }
          }
        }
      }
    });
  });

  it('should break ties recursively with overall false', function () {
    var wins = ranking([[  , 5, 0], [ 0,  , 2], [ 3, 1,  ]],
                       [0, 1, 2],
                       [{ fn: 'wins', overall: true },
                        { fn: 'goalDifference', overall: true },
                        { fn: 'wins', overall: false }]);
    expect(wins).toEqual({
      fn: 'wins',
      overall: true,
      scores: {
        1: {
          competitors: [0, 1, 2],
          rank: 0,
          tieBreak: {
            fn: 'goalDifference',
            overall: true,
            scores: {
              '2': {
                competitors: [0, 2],
                rank: 0,
                tieBreak: {
                  fn: 'wins',
                  overall: false,
                  scores: {
                    '0': {
                      competitors: [0],
                      rank: 1
                    },
                    '1': {
                      competitors: [2],
                      rank: 0
                    }
                  }
                }
              },
              '-4': {
                competitors: [1],
                rank: 2
              }
            }
          }
        }
      }
    });
  });

  it('should break ties recursively in lower ranks', function () {
    var wins = ranking([[  , 3, 4], [ 0,  , 1], [ 1, 1,  ]],
                       [0, 1, 2],
                       [{ fn: 'wins', overall: true },
                        { fn: 'goalDifference', overall: true },
                        { fn: 'goals', overall: true }]);
    expect(wins).toEqual({
      fn: 'wins',
      overall: true,
      scores: {
        2: {
          competitors: [0],
          rank: 0
        },
        0: {
          competitors: [1, 2],
          rank: 1,
          tieBreak: {
            fn: 'goalDifference',
            overall: true,
            scores: {
              '-3': {
                competitors: [1, 2],
                rank: 1,
                tieBreak: {
                  fn: 'goals',
                  overall: true,
                  scores: {
                    '1': {
                      competitors: [1],
                      rank: 2
                    },
                    '2': {
                      competitors: [2],
                      rank: 1
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
});
