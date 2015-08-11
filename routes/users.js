/*
 * Handles user relevant functions.
 * Logging into admin portal.
 */
var express = require('express');
// var jwt = require('jsonwebtoken');
var config = require('../config');
var router = express.Router();

var userProvider = require('../models/UserProvider');
var userProvider = new UserProvider();

router.route('/:name?')
	.get(function(req, res) {
		userProvider.findAll(  
			function(err, users) {
				if (err) {
					res.send(err);
				}
				res.json({ "length" : length, "users" : users });
			}
		);
	})

	// responsbile for both changing pw of existing user and creating new users.
	.post(function(req, res) {
		bcrypt.hash(req.body.password, 10, function(err, hash) {
		    var updatedUser = 
			{
				"name" : req.body.name,
				"password" : hash,
				"admin" : req.body.admin
			};
			console.log(req.body.name + " " + hash);
			userProvider.update(req.body.name,
				updatedUser,
				function(err, settings) {
					if (err) {
						res.send(err);
					}
					console.log("User updated");
					res.json(settings);
				}
			);
		});
	})

	//delete user by username
	.delete(function(req, res) {
		userProvider.delete(req.params.name,
			function(err, setting) {
				if (err) {
					res.send(err);
				}
				userProvider.findAll(function(err, settings) {
					if (err) {
						res.send(err);
					}
					res.json(settings);
				});
			}
		);
	});

module.exports = router;
