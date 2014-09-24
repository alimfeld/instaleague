'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LeagueSchema = new Schema({
  name: { type: String, required: 'true' },
  path: { type: String, required: 'true', index: { unique: true }},
  competitors: [String],
  tags: [String],
  owner: { type: String, required: 'true' },
  created: Date,
  updated: Date
});

LeagueSchema.pre('save', function(next) {
  var now = new Date();
  this.updated = now;
  if (!this.created) {
    this.created = now;
  }
  next();
});

module.exports = mongoose.model('League', LeagueSchema);
