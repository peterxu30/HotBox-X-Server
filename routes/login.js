/*
 * Handles login relevant functions.
 * Users must log in to gain admin control.
 */

var express = require('express');
var jwt = require('jsonwebtoken');
var config = require('../config');
var router = express.Router();

var userProvider = require('../models/UserProvider');
var userProvider = new UserProvider();

// Load the bcrypt module
var bcrypt = require('bcrypt');

router.route('/authenticate')

	.post(function(req, res) {
		var name = req.body.name || req.query.name || req.headers['name'];
		var password = req.body.password || req.query.password || req.headers['password'];

		userProvider.find(name, function(err, user) {
			if (err) {
				throw err;
			}

			if (!user) {
				res.json({ success: false, message: 'Authentication failed. User not found.' });
			} else if (user) {
				bcrypt.compare(password, user.password, function(err, match) {
					if (!match) {
						res.json({ "success" : false, "message" : 'Authentication failed. Wrong password.' });
					} else {
						var secret = config.secret;

						var tokenPayload = {
							"user" : user.name,
						};
						var token = jwt.sign(tokenPayload, secret, {
							expiresInMinutes: 1440 // expires in 24 hours
						});
						console.log(token); //DELETE
							// return the information including token as JSON
						res.json({
							"success" : true,
							"message" : 'Enjoy your token!',
							"token" : token
						});
					}
				});
			}

		})
	});

// set up all accounts
// router.get('/setup', function(req, res) {

// 	bcrypt.hash("mpcberkeleytlin", 10, function(err, hash) {
// 		    // Store hash in your password DB.
// 		    var updatedUser = 
// 			{
// 				"name" : "tlin051",
// 				"password" : hash,
// 			};
// 			console.log("tlin051" + " " + hash);
// 			userProvider.update("tlin051",
// 				updatedUser,
// 				function(err, user) {
// 					if (err) {
// 						res.send(err);
// 					}
// 					console.log("User updated");
// 					res.json(user);
// 				}
// 			);
// 		});

// 	bcrypt.hash("mpcberkeleypxu", 10, function(err, hash) {
// 		    // Store hash in your password DB.
// 		    var updatedUser = 
// 			{
// 				"name" : "peterxu30",
// 				"password" : hash,
// 			};
// 			console.log("tlin051" + " " + hash);
// 			userProvider.update("peterxu30",
// 				updatedUser,
// 				function(err, user) {
// 					if (err) {
// 						res.send(err);
// 					}
// 					console.log("User updated");
// 					res.json(user);
// 				}
// 			);
// 		});

// 	bcrypt.hash("mpcberkeleyhotboxx", 10, function(err, hash) {
// 		    // Store hash in your password DB.
// 		    var updatedUser = 
// 			{
// 				"name" : "hotboxx",
// 				"password" : hash,
// 			};
// 			console.log("tlin051" + " " + hash);
// 			userProvider.update("hotboxx",
// 				updatedUser,
// 				function(err, user) {
// 					if (err) {
// 						res.send(err);
// 					}
// 					console.log("User updated");
// 					res.json(user);
// 				}
// 			);
// 		});
// });

module.exports = router;
