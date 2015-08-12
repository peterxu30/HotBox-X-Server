/*
 * Handles user relevant functions.
 * Creating, deleting, and modifying accounts.
 */

var express = require('express');
var config = require('../config');
var router = express.Router();

var userProvider = require('../models/UserProvider');
var userProvider = new UserProvider();

var bcrypt = require('bcrypt');

router.route('/:name?')

	/* Get all user accounts */
	.get(function(req, res) {
		userProvider.findAll(  
			function(err, users) {
				if (err) {
					res.send(err);
				}
				res.json(users);
			}
		);
	})

	/* Change password of existing accounts and create new accounts */
	.post(function(req, res) {
		bcrypt.hash(req.body.password, 10, function(err, hash) {
		    var updatedUser = 
			{
				"name" : req.body.name,
				"password" : hash,
			};
			userProvider.update(req.body.name,
				updatedUser,
				function(err, users) {
					if (err) {
						console.log("Error");
						res.send(err);
					}
					res.sendStatus(200);
				}
			);
		});
	})

	/* Delete account by username */
	.delete(function(req, res) {
		userProvider.delete(req.params.name,
			function(err, setting) {
				if (err) {
					res.send(err);
				}
				res.sendStatus(200);
			}
		);
	});

module.exports = router;
