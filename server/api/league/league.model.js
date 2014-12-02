'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Types.ObjectId,
    Competition = require('../competition/competition.model');

var LeagueSchema = new Schema({
  name: { type: String, required: 'true' },
  competitors: [String],
  tags: [String],
  stats: [{
    competitor: Number,
    competitions: Number,
    games: Number,
    wins: Number,
    losses: Number,
    draws: Number,
    plus: Number,
    minus: Number,
    points: Number,
    tags: [Number],
    versus: [{
      opponent: Number,
      games: Number,
      wins: Number,
      losses: Number,
      draws: Number,
      plus: Number,
      minus: Number
    }]
  }],
  owner: { type: String, required: 'true' },
  created: Date,
  updated: Date
});

var League = mongoose.model('League', LeagueSchema);

LeagueSchema.pre('save', function(next) {
  var now = new Date();
  this.updated = now;
  if (!this.created) {
    this.created = now;
  }
  next();
});

Competition.schema.post('save', function(competition) {
  if (competition.confirmed) {
    League.findById(new ObjectId(competition.league.id), function(err, league) {
      if (err) {
        console.log(err);
        return;
      }
      updateStats(league);
    });
  }
});

function updateStats(league) {
  getStats(league).then(function(stats) {
    getTags(league).then(function(tags) {
      getVersus(league).then(function(versus) {
        var result = [];
        var indexedTags = indexTags(tags, league);
        var indexedVersus = indexVersus(versus);
        stats.forEach(function(entry) {
          var competitor = entry._id;
          var stat = {
            competitor: competitor,
            competitions: entry.competitions,
            games: entry.games,
            wins: entry.wins,
            losses: entry.losses,
            draws: entry.draws,
            plus: entry.plus,
            minus: entry.minus,
            points: entry.points,
            tags: indexedTags[competitor],
            versus: indexedVersus[competitor]
          };
          result.push(stat);
        });
        league.stats = result;
        league.save(function(err) {
          if (err) {
            console.log(err);
          }
        });
      });
    });
  });
}

function getStats(league) {
  return Competition.aggregate([
    { $match: { 'league.id': league._id, confirmed: true }},
    { $unwind: '$stats' },
    { $group: { _id: '$stats.competitor',
                competitions: { $sum: 1 },
                games: { $sum: '$stats.games' },
                wins: { $sum: '$stats.wins' },
                losses: { $sum: '$stats.losses' },
                draws: { $sum: '$stats.draws' },
                plus: { $sum: '$stats.plus' },
                minus: { $sum: '$stats.minus' },
                points: { $avg: '$stats.points' }
              }
    }
  ]).exec();
}

function getTags(league) {
  return Competition.aggregate([
    { $match: { 'league.id': league._id }},
    { $unwind: '$stats' },
    { $unwind: '$stats.tags' },
    { $group: { _id: { competitor: '$stats.competitor',
                       tag: '$stats.tags'
                     },
                sum: { $sum: 1 }
              }
    }
  ]).exec();
}

function indexTags(tags, league) {
  var result = [];
  tags.forEach(function(entry) {
    var competitor = entry._id.competitor;
    var tag = entry._id.tag;
    var tagStats = result[competitor] ||
      Array.apply(null, new Array(league.tags.length)).map(Number.prototype.valueOf, 0);
    tagStats[tag] = entry.sum;
    result[competitor] = tagStats;
  });
  return result;
}

function getVersus(league) {
  return Competition.aggregate([
    { $match: { 'league.id': league._id }},
    { $unwind: '$stats' },
    { $unwind: '$stats.versus' },
    { $group: { _id: { competitor: '$stats.competitor',
                       opponent: '$stats.versus.opponent'
                     },
                games: { $sum: '$stats.versus.games' },
                wins: { $sum: '$stats.versus.wins' },
                losses: { $sum: '$stats.versus.losses' },
                draws: { $sum: '$stats.versus.draws' },
                plus: { $sum: '$stats.versus.plus' },
                minus: { $sum: '$stats.versus.minus' }
              }
    }
  ]).exec();
}

function indexVersus(versus) {
  var result = [];
  versus.forEach(function(entry) {
    var competitor = entry._id.competitor;
    entry.opponent = entry._id.opponent;
    delete entry._id;
    var versus = result[competitor] || [];
    versus.push(entry);
    result[competitor] = versus;
  });
  return result;
}

module.exports = League;
