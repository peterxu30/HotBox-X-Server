/* 
 * Handles all research data related functions.
 * Takes research data from game.
 * Displays research data.
 * Converts JSON to .csv file.
 * Shows high scores on web.
 */

var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json({ type: 'application/json' });
var router = express.Router();

var dataProvider = require('../models/DataProvider');
var dataProvider = new DataProvider();

router.route('/:game?')
	.get(function(req, res) {
		dataProvider.findAll(  
			function(err, datas) {
				if (err) {
					res.send(err);
				}
				res.json(datas);
			}
		);
	})

	.post(function(req, res) {
		console.log(req.body[0]);
		for (var count = 0; count < req.body.length ; count++) {
			var data = req.body[count];
			var newData = 
			{
			 	"id" : data.id,
				"game" : data.game,
				"gameData" : data.gameData
			};

			console.log(newData);

			dataProvider.create(
				req.body,
				function(err, datas) {
					if (err) {
						res.send(err);
					}
					res.json(datas);
				}
			);

		}
	})

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
