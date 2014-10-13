'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Types.ObjectId,
    Competition = require('../competition/competition.model');

var LeagueSchema = new Schema({
  name: { type: String, required: 'true' },
  path: { type: String, required: 'true', index: { unique: true }},
  competitors: [String],
  tags: [String],
  stats: [{
    competitions: Number,
    games: Number,
    wins: Number,
    losses: Number,
    draws: Number,
    plus: Number,
    minus: Number,
    points: Number,
    tags: [Number]
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
  League.findById(new ObjectId(competition.league), function(err, league) {
    if (err) {
      console.log(err);
      return;
    }
    updateStats(league);
  });
});

function updateStats(league) {
  getStats(league).then(function(stats) {
    getTags(league).then(function(tags) {
      var indexedTags = [];
      tags.forEach(function(entry) {
        var competitor = entry._id.competitor;
        var tag = entry._id.tag;
        var tagStats = indexedTags[competitor] ||
          Array.apply(null, new Array(league.tags.length)).map(Number.prototype.valueOf, 0);
        tagStats[league.tags.indexOf(tag)] = entry.sum;
        indexedTags[competitor] = tagStats;
      });
      league.stats = [];
      stats.forEach(function(entry) {
        var competitor = entry._id;
        var stat = {
          competitions: entry.competitions,
          games: entry.games,
          wins: entry.wins,
          losses: entry.losses,
          draws: entry.draws,
          plus: entry.plus,
          minus: entry.minus,
          points: entry.points,
          tags: indexedTags[competitor]
        };
        // need to use <MongooseArray>#set function so mongoose gets notified of the change
        league.stats.set(competitor, stat);
      });
      league.save(function(err) {
        if (err) {
          console.log(err);
        }
      });
    });
  });
}

function getStats(league) {
  return Competition.aggregate([
    { $match: { league: league._id }},
    { $unwind: '$data' },
    { $match: { 'data.active': true }},
    { $group: { _id: '$data.competitor',
                competitions: { $sum: 1 },
                games: { $sum: '$data.games' },
                wins: { $sum: '$data.wins' },
                losses: { $sum: '$data.losses' },
                draws: { $sum: '$data.draws' },
                plus: { $sum: '$data.plus' },
                minus: { $sum: '$data.minus' },
                points: { $sum: '$data.points' }
              }
    }
  ]).exec();
}

function getTags(league) {
  return Competition.aggregate([
    { $match: { league: league._id }},
    { $unwind: '$data' },
    { $unwind: '$data.tags' },
    { $group: { _id: { competitor: '$data.competitor',
                       tag: '$data.tags'
                     },
                sum: { $sum: 1 }
              }
    }
  ]).exec();
}

module.exports = League;
