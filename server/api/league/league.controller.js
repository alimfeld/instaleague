'use strict';

var _ = require('lodash'),
    League = require('./league.model'),
    Competition = require('../competition/competition.model');

// Get list of leagues
exports.index = function(req, res) {
  League.find({ owner: req.user._id }, function (err, leagues) {
    if (err) { return handleError(res, err); }
    return res.json(200, leagues);
  });
};

exports.competitions = function(req, res) {
  Competition.find({ 'league.id': req.params.id }, 'date competitors stats owner confirmed', function(err, competitions) {
    if (err) { return handleError(res, err); }
    return res.json(200, competitions);
  });
};

// Get a single league
exports.show = function(req, res) {
  League.findById(req.params.id, function (err, league) {
    if (err) { return handleError(res, err); }
    if (!league) { return res.send(404); }
    return res.json(league);
  });
};

// Creates a new league in the DB.
exports.create = function(req, res) {
  var newLeague = req.body;
  newLeague.owner = req.user._id;
  League.create(newLeague, function(err, league) {
    if (err) { return handleError(res, err); }
    return res.json(201, league);
  });
};

// Updates an existing league in the DB.
exports.update = function(req, res) {
  League.findById(req.params.id, function (err, league) {
    if (err) { return handleError(res, err); }
    if (!league) { return res.send(404); }
    // only allow the owner of the league to modify it
    if (league.owner !== req.user._id.toString()) {
      return res.send(403);
    }
    // gather updateable properties in input object
    var input = {
      name: req.body.name,
      competitors: req.body.competitors,
      tags: req.body.tags
    };
    var updated = _.merge(league, input);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, league);
    });
  });
};

// Deletes a league from the DB.
exports.destroy = function(req, res) {
  League.findById(req.params.id, function (err, league) {
    if (err) { return handleError(res, err); }
    if (!league) { return res.send(404); }
    // only allow the owner of the league to modify it
    if (league.owner !== req.user._id.toString()) {
      return res.send(403);
    }
    league.remove(function(err) {
      if (err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
