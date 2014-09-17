'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LeagueSchema = new Schema({
  name: String,
  owner: String
});

module.exports = mongoose.model('League', LeagueSchema);
