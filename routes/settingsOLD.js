/*
 * Handles all configuration related functions.
 * Sending config JSON to game.
 * Displaying config settings on website.
 * Changing config settings on website.
 */

var express = require('express');
var router = express.Router();

//experimental
var settingProvider = require('../models/SettingProvider');
var settingProvider = new SettingProvider();
// var mongoose = require('mongoose');

// var schema = new mongoose.Schema(
// 	{
// 		"game" : "int",
// 		"gameMode" : String,
// 		"rewardValue" : int,
// 		"penaltyValue" : int,
// 		"minScore" : int,
// 		"playerSpeed" : float,
// 		"playerWidth" : float,
// 		"playerHeight" : float,
// 		"playerX" : float,
// 		"playerY" : float,
// 		"gravity" : float,
// 		"distribution" : String,
// 		"normalMean" : float,
// 		"normalSD" : float,
// 		"waveStart" : float,
// 		"objectWidth" : float,
// 		"objectSpeed" : float,
// 		"objectSpawnX" : float
// 	}
// );

// var settings = mongoose.model('Settings', 
// 	{
// 		"game" : Integer,
// 		"gameMode" : String,
// 		"rewardValue" : int,
// 		"penaltyValue" : int,
// 		"minScore" : int,
// 		"playerSpeed" : float,
// 		"playerWidth" : float,
// 		"playerHeight" : float,
// 		"playerX" : float,
// 		"playerY" : float,
// 		"gravity" : float,
// 		"distribution" : String,
// 		"normalMean" : float,
// 		"normalSD" : float,
// 		"waveStart" : float,
// 		"objectWidth" : float,
// 		"objectSpeed" : float,
// 		"objectSpawnX" : float
// 	}
// );

/* GET config data */
// router.get('/config', function(req, res) {
//     var collection = req.db.get('settingscollection');
//     collection.find({}, function(e, docs) {
//         res.send(docs);
//     });
// });

router.route('/config')
	.get(function(req, res) {
		settingProvider.findAll(function(err, settings) {
			res.send(settings);
		})
	});

router.get('/create', function(req, res) {
	var collection = req.db.get('settingscollection');
	collection.insert();
});

// var gameNumber = "0";
var maxNumberGames;

var count = function(collection) {
	collection.count({}, 
		function(err, numberOfDocs) {
			maxNumberGames = numberOfDocs;
		}
	);
};

/* Display config data on web */
// router.get('/:gameNumber?', function(req, res) {
// 	var collection = req.db.get('settingscollection');
// 	count(collection);
// 	if (!req.params.gameNumber) {
// 		var gameNumber = "0";
// 	} else {
// 		var gameNumber = req.params.gameNumber;
// 	}
// 	collection.find(
// 		{ "game" : gameNumber },
// 		{},
// 		function(err,docs) {
// 			if (err) {
// 				res.send("No " + gameNumber + " game setting!");
// 				gameNumber -= 1;
// 			} else {
// 		        res.render('settings/change', {
// 		        	"title" : "Change Game Settings",
// 		        	"maxNumberGames" : maxNumberGames,
// 		            "settings" : docs
// 		        });
// 		    }
// 	    }
// 	);
// });

router.route('/:gameNumber?')
	.get(function(req, res) {
		if (!req.params.gameNumber) {
			var gameNumber = "0";
		} else {
			var gameNumber = req.params.gameNumber;
		}
		settingProvider.find(req.body.game, 
			function(err, setting) {
				res.render('settings/change', {
		        	"title" : "Change Game Settings",
		        	"maxNumberGames" : maxNumberGames,
		            "settings" : setting
		    	});
			}
		)
	});

router.post('/select', function(req, res) {
	var collection = req.db.get('settingscollection');
	count(collection);
	var gameNumber;
	//test
	if (req.body.cycle) {
		gameNumber = parseInt(req.body.cycle);
		currentGame = parseInt(req.body.curr);
		gameNumber += currentGame;
	} else if (req.body.gameSelect) {
		gameNumber = parseInt(req.body.gameSelect);
	}

	/* Check if within bounds */
	if (gameNumber < maxNumberGames && gameNumber >= 0) {
		gameNumber = gameNumber.toString();
	} else {
		gameNumber = req.body.curr;
	}
	var url = 'change/' + gameNumber;
	console.log(url);
	res.redirect(url);
});

/* POST method for changing/deleting cofig data */
router.post('/update', function(req, res) {
	var collection = req.db.get('settingscollection');
	var updatedSettings = 
		{
			"game" : req.body.game,
			"gameMode" : req.body.gameMode,
			"rewardValue" : req.body.rewardValue,
			"penaltyValue" : req.body.penaltyValue,
			"minScore" : req.body.minScore,
			"playerSpeed" : req.body.playerSpeed,
			"playerWidth" : req.body.playerWidth,
			"playerHeight" : req.body.playerHeight,
			"playerX" : req.body.playerX,
			"playerY" : req.body.playerY,
			"gravity" : req.body.gravity,
			"distribution" : req.body.distribution,
			"normalMean" : req.body.normalMean,
			"normalSD" : req.body.normalSD,
			"waveStart" : req.body.waveStart,
			"objectWidth" : req.body.objectWidth,
			"objectSpeed" : req.body.objectSpeed,
			"objectSpawnX" : req.body.objectSpawnX
		};
		
	if (req.body.submit) {
		console.log("submit");
		collection.update(
			{ "game" : req.body.game },
			{ $set : updatedSettings },
			{ upsert : true },
			function(err, doc) {
				if (err) {
					res.send("There was a problem updating game settings.");
				} else {
					var url = "change/" + req.body.game;
					res.redirect(url);
				}
			}
		);
	} else if (req.body.deleteGame) {
		console.log("delete");
		collection.remove(
			updatedSettings,
			function(err, object) {
				if (err) {
					res.send("There was a problem deleting game settings.");
				} else {
					res.redirect('change');
				}
			}
		);
	}

	// collection.update(
	// 	{ "game" : req.body.game },
	// 	{ $set :
	// 		{
	// 			"game" : req.body.game,
	// 			"gameMode" : req.body.gameMode,
	// 			"rewardValue" : req.body.rewardValue,
	// 			"penaltyValue" : req.body.penaltyValue,
	// 			"minScore" : req.body.minScore,
	// 			"playerSpeed" : req.body.playerSpeed,
	// 			"playerWidth" : req.body.playerWidth,
	// 			"playerHeight" : req.body.playerHeight,
	// 			"playerX" : req.body.playerX,
	// 			"playerY" : req.body.playerY,
	// 			"gravity" : req.body.gravity,
	// 			"distribution" : req.body.distribution,
	// 			"normalMean" : req.body.normalMean,
	// 			"normalSD" : req.body.normalSD,
	// 			"waveStart" : req.body.waveStart,
	// 			"objectWidth" : req.body.objectWidth,
	// 			"objectSpeed" : req.body.objectSpeed,
	// 			"objectSpawnX" : req.body.objectSpawnX
	// 		}
	// 	}, 
	// 	{ upsert : true }, 
	// 	function(err, doc) {
	// 		if (err) {
	// 			res.send("There was a problem updating game settings.");
	// 		} else {
	// 			var url = "change/" + req.body.game;
	// 			res.redirect(url);
	// 		}
	// });
});

module.exports = router;
