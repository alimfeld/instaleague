'use strict';

var _ = require('lodash');
var Competition = require('./competition.model');

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
    return res.json(201, competition);
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

function handleError(res, err) {
  return res.send(500, err);
}