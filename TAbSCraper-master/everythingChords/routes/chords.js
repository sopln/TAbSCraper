var express = require('express');
var router = express.Router();

var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tabScraper');
var tabSchema = mongoose.Schema({
        rating: String,
        title: String,
        url: String,
        totalviews: String,
        artist: String,
        weekviews: String,
        version: String,
        chords: {strict: false},
        numcomments: String,
        numVotes: Number
});   

router.post('/', function(req, res){
	console.log(req.body);
	var statement= Tab.find(); 
	var Tab = mongoose.model('Tab', tabSchema);
	for(var i = 0; i < req.body.chords.length; i++){
		chord = "chords." + req.body.chords[i];
		statement.where(chord, 1);
	}
	statement.exec(function(err, tabs){	
		if(err) return handleError(err);
		console.log(tabs[0]);
		res.send(tabs[0]);	
	});
});
router.get('/', function(req,res){
	res.render('chords');
});

module.exports = router;
