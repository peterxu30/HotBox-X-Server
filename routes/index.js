/*
 * Top-level router. 
 * Handles nonessential pages such as home and about pages.
 */

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { "title": 'Running Game' });
});

/* GET about page */
router.get('/about', function(req, res) {
    res.render('about', { "title": 'About' });
});



/* Test stuff */
router.get('/helloworld', function(req, res, next) {
	res.render('helloworld', { title: 'Hello, world!'});
});

router.get('/testlist', function(req, res) {
    var db = req.db2;
    var collection = db.get('testcollection');
    // var collection = db.get('testcollection2');
    collection.find({},{},function(e,docs){
        res.render('testlist', {
            "testlist" : docs
        });
    });
});

router.get('/newuser', function(req, res) {
    res.render('newuser', { title: 'Add New User' });
});

router.post('/adduser', function(req, res) {

    // Set our internal DB variable
    var db = req.db2;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userScore = req.body.score;

    // Set our collection
    var collection = db.get('testcollection');

    // Submit to the DB
    collection.insert({
        "username" : userName,
        "score" : userScore
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("testlist");
        }
    });
});

module.exports = router;
