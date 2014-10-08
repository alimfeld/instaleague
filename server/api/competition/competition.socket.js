/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Competition = require('./competition.model');

exports.register = function(socket) {
  Competition.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Competition.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('competition:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('competition:remove', doc);
}