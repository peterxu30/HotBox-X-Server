/* 
 * Handles all game settings data related functions.
 * Sends settings to game.
 * Displays settings.
 */

var express = require('express');
var router = express.Router();

var settingProvider = require('../models/SettingProvider');
var settingProvider = new SettingProvider();

/* Number of game settings */
var length;

/* Counts number of game settings */
var count = function() {
	settingProvider.count({}, 
		function(err, numberOfDocs) {
			length = numberOfDocs;
		}
	);
};

/* Check number of game settings after every change */
router.use(function(req, res, next) {
	count();
	next();
});


router.route('/:game?')

	/* Get game settings */
	.get(function(req, res) {
		settingProvider.findAll(  
			function(err, settings) {
				if (err) {
					res.send(err);
				}
				res.json({ "length" : length, "settings" : settings });
			}
		);
	})

	/* Add new/updated game settings to database */
	.post(function(req, res) {
		var updatedSettings = 
		{
			"game" : req.body.game,
			"gameMode" : req.body.gameMode,
			"timed" : req.body.timed,
			"timeLimit" : req.body.timeLimit,
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
			"gapHeight" : req.body.gapHeight,
			"objectWidth" : req.body.objectWidth,
			"objectSpeed" : req.body.objectSpeed,
			"objectSpawnX" : req.body.objectSpawnX
		};

		settingProvider.update(req.body.game,
			updatedSettings,
			function(err, settings) {
				if (err) {
					res.send(err);
				}
				res.json(settings);
			}
		);
	})
	
	/* Delete specific game settings */
	.delete(function(req, res) {
		settingProvider.delete(req.params.game,
			function(err, setting) {
				if (err) {
					res.send(err);
				}
				settingProvider.findAll(function(err, settings) {
					if (err) {
						res.send(err);
					}
					res.json(settings);
				});
			}
		);
	});

module.exports = router;
