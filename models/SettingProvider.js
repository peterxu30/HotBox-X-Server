/*
 * Mongoose model for game settings 
 */

var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost:27017/settingscollection');

var schema = mongoose.Schema;

/* Setting format */
var Setting = new mongoose.Schema({
	"game" : String,
	"gameMode" : String,
	"rewardValue" : String,
	"penaltyValue" : String,
	"minScore" : String,
	"playerSpeed" : String,
	"playerWidth" : String,
	"playerHeight" : String,
	"playerX" : String,
	"playerY" : String,
	"gravity" : String,
	"distribution" : String,
	"normalMean" : String,
	"normalSD" : String,
	"waveStart" : String,
	"objectWidth" : String,
	"objectSpeed" : String,
	"objectSpawnX" : String
});

db.model('Setting', Setting);
var Setting = db.model('Setting');

/* What is exported from this file */
SettingProvider = function(){};

/* Find all game settings */
SettingProvider.prototype.findAll = function(callback) {
	Setting.find()
		.sort("game")
		.exec(function(err, settings) {
			if (!err) {
				callback(null, settings);
			}
		});
};

/* Find specific game setting */
SettingProvider.prototype.find = function(game, callback) {
	Setting.find({ "game" : game },
		{}, 
		function(err, setting) {
			if (!err) {
				callback(null, setting);
			}
		}
	);
};

/* Update specific game setting */
SettingProvider.prototype.update = function(game, setting, callback) {
	Setting.update({ "game" : game }, // didn't use save because don't want update by _id
		setting,
		{ upsert : true },
		function(err, doc) {
			if (!err) {
				callback();
			}
		}
	);
};

/* Delete specific game setting */
SettingProvider.prototype.delete = function(game, callback) {
	Setting.remove({ "game" : game },
		function(err, object) {
			if (!err) {
				callback();
			}
		}
	);
};

/* Count number of game settings */
SettingProvider.prototype.count = function(criteria, callback) {
	Setting.count(criteria,
		function(err, numberOfDocs) {
			if (!err) {
				callback(null, numberOfDocs);
			}
		}
	);
};

// new SettingProvider().update(0, 
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
// 	function(err, setting){
// 		console.log("updated setting");
// 	}
// );

exports.SettingProvider = SettingProvider;
