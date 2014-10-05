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
                       [{ fn: 'wins' }]);
    expect(wins).toEqual({
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
    var wins = ranking([[  , 2, 1], [ 1,  , 2], [ 2, 0,  ]],
                       [0, 1, 2],
                       [{ fn: 'wins' },
                        { fn: 'goalDifference' }]);
    expect(wins).toEqual({
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
    var wins = ranking([[  , 5, 0], [ 0,  , 2], [ 3, 1,  ]],
                       [0, 1, 2],
                       [{ fn: 'wins' },
                        { fn: 'goalDifference' },
                        { fn: 'goals' }]);
    expect(wins).toEqual({
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
    var wins = ranking([[  , 5, 0], [ 0,  , 2], [ 3, 1,  ]],
                       [0, 1, 2],
                       [{ fn: 'wins' },
                        { fn: 'goalDifference' },
                        { fn: 'wins', direct: true }]);
    expect(wins).toEqual({
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
    var wins = ranking([[  , 3, 4], [ 0,  , 1], [ 1, 1,  ]],
                       [0, 1, 2],
                       [{ fn: 'wins' },
                        { fn: 'goalDifference' },
                        { fn: 'goals' }]);
    expect(wins).toEqual({
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
});
