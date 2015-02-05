var express = require('express');
var router = express.Router();
var db = require('../lib/model');
var logError = require('../lib/logError');

function eventList(request, response) {
  db.view('events/all', function (err, view_response) {
    if (err){
      console.log('Problem getting all events', err);
      logError(view_response, err);
    } else {
      var result_set = [];
      view_response.forEach(function (row) {
        result_set.push(row);
      });
      response.send(result_set);
    }
  });
}

function getEvent(req, res) {
  db.get(req.params.id, function (err, doc) {
    if (err){
      console.log('Problem getting document "'+req.params.id+'"', err);
      if (err.error === "not_found")
    res.status(400).send({error: 'Object not found: ' + err.reason});
    } else {
      res.status(200).send(doc);
    }
  });
}

function createEvent(req, res) {
  var doc = req.body;
  console.log("Request body: "+JSON.stringify(doc, undefined,2));

  if (checkFields(doc,res) > 0) return;

  db.save(
      doc,
      function(err, response){
        if (err){
          console.log('Problem saving document', err);
          logError(response, err);
        } else {
          var new_doc = {};
          for (key in response){
            new_doc[key] = response[key];
          }
          res.status(201).send(new_doc);
        }
      }
      );
}

function errorResponse (res, statusCode, errorMessage){
  res.status(statusCode).send({error: errorMessage});
}

function checkFields (doc,res){
  var errorFlag = 0;

  if (!doc.type) {
    errorResponse(res, 400, 'Invalid input. Missing parameter: type');
    errorFlag = 1;
  } else if (!doc.name) {
    errorResponse(res, 400, 'Invalid input. Missing parameter: name');
    errorFlag = 1;
  } else if (!doc.address) {
    errorResponse(res, 400, 'Invalid input. Missing parameter: address');
    errorFlag = 1;
  } else if (!doc.dateTimestamp) {
    errorResponse(res, 400, 'Invalid input. Missing parameter: Timestamp');
    errorFlag = 1;
  }

  return errorFlag;
}

function errorSavingHandler (err, response){
  // Handle response
  if (err){
    console.log('Problem saving document', err);
    logError(response, err);
  } else {
    var new_doc = {};
    for (key in response){
      new_doc[key] = response[key];
    }
    res.status(201).send(new_doc);
  }
}

function updateEvent(req, res) {
  var doc = req.body;

  if (checkFields(doc,res) > 0) return;

  db.save(
      doc._id,
      doc._rev,
      doc,
      function(err, response){
        if (err){
          console.log('Problem saving document', err);
          logError(response, err);
        } else {
          var new_doc = {};
          for (key in response){
            new_doc[key] = response[key];
          }
          res.status(201).send(new_doc);
        }
      }
      );
}

function deleteEvent(req, res) {
  if (!req.params.id) {
    res.status(400).send({error: 'Invalid input. Missing parameter: _id.'});
    return;
  } else if (!req.params.rev) {
    res.status(400).send({error: 'Invalid input. Missing parameter: _rev.'});
    return;
  }
  db.get(req.params.id, function (get_err, doc) {
    if (get_err){
      console.log('Problem getting document "'+req.params.id+'"', get_err);
      res.status(404).send({error: 'Document not found.'});
    } else {
      db.remove(req.params.id, req.params.rev, function (del_err, response) {
        if (del_err) {
          console.log('Problem deleting document "'+req.params.id+'"', del_err);
          logError(response,del_err);
        } else {
          res.send(response);
        }
      });
    }
  });
}

/* GET event listing. */
router.get('/', eventList);
router.post('/', createEvent);
router.put('/', updateEvent);
router.get('/:id', getEvent);
router.get('/:id/:rev', getEvent);
router.delete('/:id/:rev', deleteEvent);


module.exports = router;
