'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ranking = require('./ranking');

var CompetitionSchema = new Schema({
  date: Date,
  league: Schema.ObjectId,
  competitors: [Number],
  tags: [],
  results: [],
  stats: [{
    competitor: Number,
    tags: [Number],
    results: [Number],
    games: Number,
    wins: Number,
    losses: Number,
    draws: Number,
    plus: Number,
    minus: Number,
    rank: Number,
    tied: Number,
    hint: String,
    points: Number,
    versus: [{
      opponent: Number,
      games: Number,
      wins: Number,
      losses: Number,
      draws: Number,
      plus: Number,
      minus: Number
    }]
  }]
});

CompetitionSchema.pre('save', function(next) {
  this.stats = ranking.rank(
    this.results,
    this.competitors,
    [{ fn: 'wins' },
      { fn: 'draws' },
      { fn: 'goalDifference' },
      { fn: 'goals' },
      { fn: 'wins', direct: true }]);
  var competition = this;
  this.stats.forEach(function(stat) {
    stat.tags = competition.tags[stat.competitor];
  });
  next();
});

module.exports = mongoose.model('Competition', CompetitionSchema);
