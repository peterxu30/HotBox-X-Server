/*
 * Mongoose model for user accounts
 */

var config = require('../config');

var mongoose = require('mongoose');
var db = mongoose.createConnection(config.database);

var schema = mongoose.Schema;

/* User format */
var User = new mongoose.Schema({
	"name" : String,
	"password" : String,
});

db.model('User', User);
var User = db.model('User');

/* What is exported from this file */
UserProvider = function(){};

/* Find all accounts */
UserProvider.prototype.findAll = function(callback) {
	User.find()
		.sort("name")
		.exec(function(err, settings) {
			if (!err) {
				callback(null, settings);
			}
		});
};

/* Find specific account */
UserProvider.prototype.find = function(name, callback) {
	User.find({ "name" : name },
		{}, 
		function(err, User) {
			if (!err) {
				callback(null, User[0]);
			}
		}
	);
};

/* Update specific account */
UserProvider.prototype.update = function(name, user, callback) {
	User.update({ "name" : name }, // didn't use save because don't want update by _id
		user,
		{ upsert : true },
		function(err, doc) {
			console.log("UserProvider");
			if (!err) {
				callback();
			}
		}
	);
};

/* Delete specific account */
UserProvider.prototype.delete = function(name, callback) {
	User.remove({ "name" : name },
		function(err, object) {
			if (!err) {
				callback();
			}
		}
	);
};

/* Count number of users */
UserProvider.prototype.count = function(criteria, callback) {
	User.count(criteria,
		function(err, numberOfDocs) {
			if (!err) {
				callback(null, numberOfDocs);
			}
		}
	);
};

exports.UserProvider = UserProvider;
