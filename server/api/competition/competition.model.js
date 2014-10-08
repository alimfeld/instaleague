'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CompetitionSchema = new Schema({
  date: Date,
  league: Schema.ObjectId,
  data: [{
    competitor: Number,
    active: Boolean,
    tags: [String],
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
    points: Number
  }]
});

module.exports = mongoose.model('Competition', CompetitionSchema);
