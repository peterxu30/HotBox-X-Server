/* Verifies valid token before allowing any HTTP requests to protected routes */

var express = require('express');
var jwt = require('jsonwebtoken');
var config = require('../config');

var router = express.Router();

/* 
 * Code borrowed from Scotch.io tutorial.
 * Source: https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens
 */
var tokenauth = function(req, res, next) {
	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	// decode token
	if (token) {
			// verifies secret and checks exp
		jwt.verify(token, config.secret, function(err, decoded) {      
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' }); 
			} else {
			// if everything is good, save to request for use in other routes
				req.decoded = decoded;    
				next();
			}
		});

	} else {
		// if there is no token
		// return an error
		return res.status(403).send({ 
		    success: false, 
		    message: 'No token provided.' 
		});

	}
};

module.exports = tokenauth;
