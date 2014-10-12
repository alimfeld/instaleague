'use strict';

var _ = require('lodash'),
    Competition = require('./competition.model'),
    ObjectId = require('mongoose').Types.ObjectId;

// Get list of competitions
exports.index = function(req, res) {
  Competition.find(function (err, competitions) {
    if(err) { return handleError(res, err); }
    return res.json(200, competitions);
  });
};

// Get a single competition
exports.show = function(req, res) {
  Competition.findById(req.params.id, function (err, competition) {
    if(err) { return handleError(res, err); }
    if(!competition) { return res.send(404); }
    return res.json(competition);
  });
};

// Creates a new competition in the DB.
exports.create = function(req, res) {
  Competition.create(req.body, function(err, competition) {
    if(err) { return handleError(res, err); }
    updateStats(req.body.league, function(err) {
      if (err) { return handleError(res, err); }
      return res.json(201, competition);
    });
  });
};

// Updates an existing competition in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Competition.findById(req.params.id, function (err, competition) {
    if (err) { return handleError(res, err); }
    if(!competition) { return res.send(404); }
    var updated = _.merge(competition, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, competition);
    });
  });
};

// Deletes a competition from the DB.
exports.destroy = function(req, res) {
  Competition.findById(req.params.id, function (err, competition) {
    if(err) { return handleError(res, err); }
    if(!competition) { return res.send(404); }
    competition.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function updateStats(leagueId, callback) {
  updateStandings(leagueId, function(err, res) {
    if (err) { callback(err, res); }
    updateTags(leagueId, callback);
  });
}

function updateStandings(leagueId, callback) {
  var result = Competition.aggregate([
    { $match: { league: new ObjectId(leagueId) }},
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
    },
    { $out: 'standings_' + leagueId }
  ], callback);
}

function updateTags(leagueId, callback) {
  var result = Competition.aggregate([
    { $match: { league: new ObjectId(leagueId) }},
    { $unwind: '$data' },
    { $unwind: '$data.tags' },
    { $group: { _id: { competitor: '$data.competitor',
                       tag: '$data.tags'
                     },
                sum: { $sum: 1 }
              }
    },
    { $out: 'tags_' + leagueId }
  ], callback);
}

function handleError(res, err) {
  return res.send(500, err);
}
