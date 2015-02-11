'use strict';

var _ = require('lodash'),
    Competition = require('./competition.model');

// Get list of my competitions
exports.mine = function(req, res) {
  // only show competitions that are not yet confirmed
  // and the user is either the competition or the league owner;
  // i.e. the user has created the competition or needs to confirm it
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
  Competition.find(query, 'league date competitors owner confirmed', function (err, competitions) {
    if (err) { return handleError(res, err); }
    return res.json(200, competitions);
  });
};

// Get a single competition
exports.show = function(req, res) {
  Competition.findById(req.params.id, function (err, competition) {
    if (err) { return handleError(res, err); }
    if (!competition) { return res.send(404); }
    return res.json(competition);
  });
};

// Creates a new competition in the DB.
exports.create = function(req, res) {
  var newCompetition = req.body;
  newCompetition.owner = req.user._id;
  Competition.create(newCompetition, function(err, competition) {
    if (err) { return handleError(res, err); }
    return res.json(201, competition);
  });
};

// Acts on a competition
exports.act = function(req, res) {
  Competition.findById(req.params.id, function (err, competition) {
    if (err) { return handleError(res, err); }
    if (!competition) { return res.send(404); }
    if (req.body.action === 'confirm') {
      if (competition.confirmed === true) {
        return res.send(409);
      }
      // only allow the league owner to confirm a competition within that league
      var user = req.user._id.toString();
      if (competition.league.owner !== user) {
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
  Competition.findById(req.params.id, function (err, competition) {
    if (err) { return handleError(res, err); }
    if (!competition) { return res.send(404); }
    if (!modificationGranted(req.user, competition)) {
      return res.send(403);
    }
    // gather updateable properties in input object
    var input = {
      date: req.body.date,
      competitors: req.body.competitors,
      tags: req.body.tags,
      results: req.body.results
    };
    var updated = _.merge(competition, input, function(objectValue, sourceValue) {
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
    if (err) { return handleError(res, err); }
    if (!competition) { return res.send(404); }
    if (!modificationGranted(req.user, competition)) {
      return res.send(403);
    }
    competition.remove(function(err) {
      if (err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

function modificationGranted(user, competition) {
  var userId = user._id.toString();
  // modifications are only granted to the league owner or the creator of the competition
  // in case it's not yet confirmed
  return competition.league.owner === userId || (competition.owner === userId && !competition.confirmed);
}
