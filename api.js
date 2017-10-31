var bodyparser = require("body-parser");
var httpstatus = require("http-status");
var express = require("express");
var underscore = require("underscore");

module.exports = function(wagner){

	api = express.Router();

	api.get("/", function(req, res){
		res.sendFile("/client/index.html");
		// res.json({message: "hello world!"});
	});

	api.get("/report", wagner.invoke(function(db){
		return function(req, res){
			db.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
			  if (error) throw error;
			  res.json({message: 'The solution is: ' + results[0].solution});
			}
		);
	}}));

	return api;
}