/*
 * Mongoose model for game data
 */

var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost:27017/datacollection');

var schema = mongoose.Schema;

/* Data format */
var Data = new mongoose.Schema({
	"id" : String,
	"game" : Number,
	"gameData" : [{
		"timeStamp" : Number,
		"waveSpawned" : Boolean,
		"pressedSpace" : Boolean,
		"obstacleCollision" : Boolean,
		"rewarded" : Boolean,
		"playerY" : Number,
		"rewardX" : Number,
		"rewardY" : Number,
		"numberOfObstacles" : Number,
		"obstacle1X" : Number,
		"obstacle1Y" : Number,
		"obstacle1Height" : Number,
		"obstacle2X" : Number,
		"obstacle2Y" : Number,
		"obstacle2Height" : Number,
		"obstacle3X" : Number,
		"obstacle3Y" : Number,
		"obstacle3Height" : Number,
		"score" : Number
	}]
});

db.model('Data', Data);
var Data = db.model('Data');

/* What is exported from this file */
DataProvider = function(){};

/* Find all game data */
DataProvider.prototype.findAll = function(callback) {
	Data.find()
		.sort("game")
		.exec(function(err, datas) {
			if (!err) {
				callback(null, datas);
			}
		});
};

/* Find game data for specific game */
DataProvider.prototype.find = function(game, callback) {
	Data.find({ "game" : game },
		{}, 
		function(err, data) {
			if (!err) {
				callback(null, data);
			}
		}
	);
};

/* Create new game data */
DataProvider.prototype.create = function(data, callback) {
	Data.create(data,
		function(err, doc) {
			if (!err) {
				callback();
			}
		}
	);
};

/* Delete all game data for one game type */
DataProvider.prototype.delete = function(game, callback) {
	Data.remove({ "game" : game },
		function(err, object) {
			if (!err) {
				callback();
			}
		}
	);
};

/* Count number of game data objects */
DataProvider.prototype.count = function(criteria, callback) {
	Data.count(criteria,
		function(err, numberOfDocs) {
			if (!err) {
				callback(null, numberOfDocs);
			}
		}
	);
};

exports.DataProvider = DataProvider;
