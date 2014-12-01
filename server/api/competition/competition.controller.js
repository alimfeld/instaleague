'use strict';

var _ = require('lodash'),
    Competition = require('./competition.model');

// Get list of competitions
exports.index = function(req, res) {
  var query = {
    $or: [{
      owner: req.user._id
    }, {
      league: {
        owner: req.user._id
      }
    }],
    confirmed: false
  };
  Competition.find(query, function (err, competitions) {
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
  var newCompetition = req.body;
  newCompetition.owner = req.user._id;
  Competition.create(newCompetition, function(err, competition) {
    if(err) { return handleError(res, err); }
    return res.json(201, competition);
  });
};

// Acts on a competition
exports.act = function(req, res) {
  Competition.findById(req.params.id, function (err, competition) {
    if (err) { return handleError(res, err); }
    if(!competition) { return res.send(404); }
    if (req.body.action === 'confirm') {
      if (competition.confirmed === true) {
        return res.send(409);
      }
      if (competition.league.owner !== req.user._id.toString()) {
        return res.send(403);
      }
      competition.confirmed = true;
      competition.save(function (err) {
        if (err) { return handleError(res, err); }
        return res.json(204, competition);
      });
    } else {
      return res.send(400);
    }
  });
};

// Updates an existing competition in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Competition.findById(req.params.id, function (err, competition) {
    if (err) { return handleError(res, err); }
    if(!competition) { return res.send(404); }
    var updated = _.merge(competition, req.body, function(objectValue, sourceValue) {
      return _.isArray(sourceValue) ? sourceValue : undefined;
    });
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

function handleError(res, err) {
  return res.send(500, err);
}
