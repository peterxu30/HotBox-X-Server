/* 
 * Handles all research data related functions.
 * Takes research data from game.
 * Displays research data.
 * Converts JSON to .csv file.
 * Shows high scores on web.
 */

var express = require('express');
var router = express.Router();

var dataProvider = require('../models/DataProvider');
var dataProvider = new DataProvider();

/* Number of game data objects */
var length;

/* Checks if data has been updated. 
 * If yes, reconvert JSON --> CSV 
 * If no, send old csv.
 */
var updated = true;
var csvString;

/* Counts number of game data objects */
var count = function() {
	dataProvider.count({}, 
		function(err, numberOfDocs) {
			length = numberOfDocs;
		}
	);
};

/* Check number of game data objects after every change */
router.use(function(req, res, next) {
	count();
	next();
});

router.route('/csv')
	/* Get CSV file of game data */
	.get(function(req, res) {
		dataProvider.findAll(
			function(err, datas) {
				if (err) {
					res.send(err);
				}
				if (updated) {
					csvString = json2csv(datas); //datas is array of game data objects
					updated = false;
				}
				res.send(csvString);
			}
		);
	});

/* JSON to CSV converter for game data */
function json2csv(data) {
	var csv = '';
	var comma = ',';
	var newLine = '\n';

	//csv header
	csv += "id,game,timeStamp,waveSpawned,pressedSpace,obstacleCollision,rewarded,playerY,rewardX,rewardY,"
		+ "numberOfObstacles,obstacle1X,obstacle1Y,obstacle1Height,obstacle2X,obstacle2Y,obstacle2Height," 
		+ "obstacle3X,obstacle3Y,obstacle3Height" + newLine;

	for (index in data) {
		var currentData = data[index];
		var header = currentData.id + comma; 
		header += currentData.game + comma;

		var gameData = currentData.gameData;
		for (i = 0; i < gameData.length; i++) {
			var currData = gameData[i];
			csv += header;
			csv += currData.timeStamp + comma;
			csv += currData.waveSpawned + comma;
			csv += currData.pressedSpace + comma;
			csv += currData.obstacleCollision + comma;
			csv += currData.rewarded + comma;
			csv += currData.playerY + comma;
			csv += currData.rewardX + comma;
			csv += currData.rewardY + comma;
			csv += currData.numberOfObstacles + comma;
			csv += currData.obstacle1X + comma;
			csv += currData.obstacle1Y + comma;
			csv += currData.obstacle1Height + comma;
			csv += currData.obstacle2X + comma;
			csv += currData.obstacle2Y + comma;
			csv += currData.obstacle2Height + comma;
			csv += currData.obstacle3X + comma;
			csv += currData.obstacle3Y + comma;
			csv += currData.obstacle3Height + newLine;
		}
		csv += newLine;
	}
	return csv;
}

router.route('/:game?/')
	/* Get all game data */
	.get(function(req, res) {
		dataProvider.findAll(  
			function(err, datas) {
				if (err) {
					res.send(err);
				}
				datas.sort(function(obj1, obj2) {
					return obj1.game - obj2.game;
				});
				res.json({ "length" : length, "data" : datas });
			}
		);
	})

	/* Add new game data to database */
	.post(function(req, res) {
		updated = true;
		for (var count = 0; count < req.body.length ; count++) {
			var data = req.body[count];
			var newData = 
			{
			 	"id" : data.id,
				"game" : data.game,
				"gameData" : data.gameData
			};

			dataProvider.create(
				newData,
				function(err, datas) {
					if (err) {
						res.send(err);
					}
					res.json(datas);
				}
			);

		}
	})

	/* Delete game data for specific game type */
	.delete(function(req, res) {
		dataProvider.delete(req.params.game,
			function(err, data) {
				if (err) {
					res.send(err);
				}
				dataProvider.findAll( function(err, datas) {
					if (err) {
						res.send(err);
					}
					res.json(datas);
				});
			}
		);
	});

module.exports = router;
