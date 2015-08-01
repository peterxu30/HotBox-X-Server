var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost:27017/datacollection');

var schema = mongoose.Schema;
var objectID = schema.ObjectID;

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

// mongoose.model('Data', Data);
db.model('Data', Data);
var Data = db.model('Data');

DataProvider = function(){};

DataProvider.prototype.findAll = function(callback) {
	Data.find()
		.sort("game")
		.exec(function(err, datas) {
			if (!err) {
				callback(null, datas);
			}
		});
};

DataProvider.prototype.find = function(game, callback) {
	Data.find(
		{ "game" : game },
		{}, 
		function(err, data) {
			if (!err) {
				callback(null, data);
			}
		}
	);
};

DataProvider.prototype.create = function(data, callback) {
	Data.create(
		data,
		function(err, doc) {
			if (!err) {
				callback();
			}
		}
	);
};

DataProvider.prototype.delete = function(game, callback) {
	Data.remove(
		{ "game" : game },
		function(err, object) {
			if (!err) {
				callback();
			}
		}
	);
};

DataProvider.prototype.count = function(criteria, callback) {
	Data.count(criteria,
		function(err, numberOfDocs) {
			if (!err) {
				callback(null, numberOfDocs);
			}
		}
	);
};

// experimental
// DataProvider.prototype.deleteBy = function(attribute, value, callback) {
// 	Data.remove(
// 		{ attribute : value },
// 		function(err, object) {
// 			if (!err) {
// 				callback();
// 			}
// 		});
// }

// DataProvider.prototype.deleteAll = function(callback) {
// 	Data.remove(
// 		{},
// 		function(err, object) {
// 			if (!err) {
// 				callback();
// 			}
// 		});
// }

exports.DataProvider = DataProvider;
