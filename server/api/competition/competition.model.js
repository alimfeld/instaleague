'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ranking = require('./ranking');

var CompetitionSchema = new Schema({
  date: Date,
  league: {
    id: Schema.ObjectId,
    name: String,
    owner: String
  },
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
  }],
  owner: { type: String, required: 'true' },
  confirmed: {type: Boolean, default: false }
});

CompetitionSchema.pre('save', function(next) {
  this.stats = ranking.rankDefault(this.results, this.competitors);
  var competition = this;
  this.stats.forEach(function(stat) {
    stat.tags = competition.tags[stat.competitor];
  });
  next();
});

CompetitionSchema.pre('save', function(next) {
  var competition = this;
  if (!competition.league.name || !competition.league.owner) {
    var League = require('../league/league.model');
    League.findById(competition.league.id, function (err, league) {
      competition.league.name = league.name;
      competition.league.owner = league.owner;
      next();
    });
  } else {
    next();
  }
});

module.exports = mongoose.model('Competition', CompetitionSchema);
