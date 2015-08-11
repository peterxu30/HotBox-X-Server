var config = require('../config');

var mongoose = require('mongoose');
var db = mongoose.createConnection(config.database);

var schema = mongoose.Schema;

var User = new mongoose.Schema({
	"name" : String,
	"password" : String,
	"admin" : Boolean
});

db.model('User', User);
var User = db.model('User');

UserProvider = function(){};

UserProvider.prototype.findAll = function(callback) {
	User.find()
		.sort("name")
		.exec(function(err, settings) {
			if (!err) {
				callback(null, settings);
			}
		});
};

UserProvider.prototype.find = function(name, callback) {
	User.find(
		{ "name" : name },
		{}, 
		function(err, User) {
			if (!err) {
				callback(null, User[0]);
			}
		}
	);
};

UserProvider.prototype.update = function(name, user, callback) {
	User.update( // didn't use save because don't want update by _id
		{ "name" : name },
		user,
		{ upsert : true },
		function(err, doc) {
			if (!err) {
				callback();
			}
		}
	);
};

UserProvider.prototype.delete = function(name, callback) {
	User.remove(
		{ "name" : name },
		function(err, object) {
			if (!err) {
				callback();
			}
		}
	);
};

UserProvider.prototype.count = function(criteria, callback) {
	User.count(criteria,
		function(err, numberOfDocs) {
			if (!err) {
				callback(null, numberOfDocs);
			}
		}
	);
};

// new UserProvider().update(0, 
// 	{
// 		"game" : "0",
// 		"gameMode" : "penalty",
// 		"rewardValue" : "1",
// 		"penaltyValue" : "5",
// 		"minScore" : "0",
// 		"playerSpeed" : "7.3",
// 		"playerWidth" : "32",
// 		"playerHeight" : "32",
// 		"playerX" : "60",
// 		"playerY" : "240",
// 		"gravity" : "14",
// 		"distribution" : "uniform",
// 		"normalMean" : "1",
// 		"normalSD" : "1",
// 		"waveStart" : "480",
// 		"objectWidth" : "18",
// 		"objectSpeed" : "6",
// 		"objectSpawnX" : "800"
// 	},
// 	function(err, User){
// 		console.log("updated User");
// 	}
// );

exports.UserProvider = UserProvider;
