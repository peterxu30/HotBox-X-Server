/* 
 * Handles all game settings data related functions.
 * Sends settings to game.
 * Displays settings.
 */

var express = require('express');
var router = express.Router();

var settingProvider = require('../models/SettingProvider');
var settingProvider = new SettingProvider();

router.route('/:game?')
	.get(function(req, res) {
		settingProvider.findAll(  
			function(err, settings) {
				if (err) {
					res.send(err);
				}
				res.json(settings);
			}
		);
	})

	.post(function(req, res) {
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
		console.log(req.body.game);
		settingProvider.update(req.body.game,
			updatedSettings,
			function(err, settings) {
				if (err) {
					res.send(err);
				}
				console.log("Settings updated");
				res.json(settings);
			}
		);
	})

	.delete(function(req, res) {
		settingProvider.delete(req.params.game,
			function(err, setting) {
				if (err) {
					res.send(err);
				}
				settingProvider.findAll( function(err, settings) {
					if (err) {
						res.send(err);
					}
					res.json(settings);
				});
			}
		);
	});

module.exports = router;
