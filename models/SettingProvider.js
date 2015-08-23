/*
 * Mongoose model for game settings 
 */

var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost:27017/settingscollection');

var schema = mongoose.Schema;

/* Setting format */
var Setting = new mongoose.Schema({
	"game" : Number,
	"gameMode" : String,
	"timed" : Boolean,
	"timeLimit" : Number,
	"rewardValue" : Number,
	"penaltyValue" : Number,
	"minScore" : Number,
	"playerSpeed" : Number,
	"playerWidth" : Number,
	"playerHeight" : Number,
	"playerX" : Number,
	"playerY" : Number,
	"gravity" : Number,
	"distribution" : String,
	"normalMean" : Number,
	"normalSD" : Number,
	"waveStart" : Number,
	"gapWidth" : Number,
	"objectWidth" : Number,
	"objectSpeed" : Number,
	"objectSpawnX" : Number
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

exports.SettingProvider = SettingProvider;
