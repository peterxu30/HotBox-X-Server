var express = require('express');
var router = express.Router();

var settingProvider = require('../models/SettingProvider');
var settingProvider = new SettingProvider();

var totalNumberGames;

var count = function() {
	settingProvider.count({}, 
		function(err, numberOfDocs) {
			totalNumberGames = numberOfDocs;
		}
	);
};

/* Check total number of games before every call */
router.use(function(req, res, next) {
	count();
	next();
	console.log("counted " + totalNumberGames);
});

//unnecessary
// router.route('/config')
// 	.get(function(req, res) {
// 		settingProvider.findAll(function(err, settings) {
// 			res.send(settings);
// 		})
// 	});

router.route('/:gameNumber?')
	.get(function(req, res) {
		// if (req.params.gameNumber 
		// 	&& req.params.gameNumber >= 0 
		// 	&& req.params.gameNumber < totalNumberGames) {
		// 	var gameNumber = req.params.gameNumber;
		// } else {
		// 	var gameNumber = "0";
		// }
		settingProvider.findAll(  
			function(err, settings) {
				// res.render('settings/display', {
		  //       	"title" : "Change Game Settings",
		  //       	"totalNumberGames" : totalNumberGames,
		  //           "settings" : setting
		  //   	});
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
		settingProvider.update(req.body.game,
			updatedSettings,
			function(err, settings) {
				// var url = '/settings/' + req.body.game;
				// res.redirect(url);
				if (err) {
					res.send(err);
				}
				res.json(settings);
			}
		);
	})

	.delete(function(req, res) {
		settingProvider.delete(req.params.gameNumber,
			function(err, setting) {
				if (err) {
					res.send(err);
				}
				settingProvider.find(function(err, settings) {
					if (err) {
						res.send(err);
					}
					res.json(settings);
				});
			}
		);
	});

//replace this with angular
router.route('/select')
	.post(function(req, res) {
		console.log("Selected " + req.body.select);
		var url = '/settings/' + req.body.select;
		res.redirect(url);
	});

module.exports = router;
