/*
 * Handles user relevant functions.
 * Logging into admin portal.
 */

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// logging in

module.exports = router;
