var bodyparser = require("body-parser");
var httpstatus = require("http-status");
var express = require("express");
var underscore = require("underscore");
var queries = require("./queries");

module.exports = function(wagner){

	api = express.Router();

	api.get("/", function(req, res){
		res.sendFile("/client/index.html");
		// res.json({message: "hello world!"});
	});

	api.get("/testing", function(req, res){
		res.sendFile(__dirname + "/client/testing.html");
		// res.json({message: "hello world!"});
	});

	api.get("/report", wagner.invoke(function(db){
		return function(req, res){
			console.log(req.params);
			var all_results = {};
			// console.log("Querying for chart 1: " + queries.chart1);
			db.query(queries.chart1, function (error, results, fields) {
				// console.log("chart1 error: "+ error + "chart1 results: " + results);
				if (error){
					res.json({message: "chart1 error"});
					return;
				}
				all_results.chart1 = results;
				db.query(queries.chart2, function (error, results, fields) {
					if (error){
						res.json({message: "chart2 error"});
						return;
					}
					all_results.chart2 = results;
					db.query(queries.chart3, function (error, results, fields) {
						if (error){
							res.json({message: "chart3 error"});
							return;
						}
						all_results.chart3 = results;
						db.query(queries.chart4, function (error, results, fields) {
							if (error){
								res.json({message: "chart4 error"});
								return;
							}
							all_results.chart4 = results;
							console.log(all_results);
							res.json({
								results: all_results,
								titles: {
									chart1: "Top 20 FSP Entries per 1000 KM",
									chart2: "Actual I-Step Distribution(KW 40)",
									chart3: "Top 10 Driven KM",
									chart4: "Single Event DTCs"
								},
								category_fields: {
									chart1: "FSP_Entry",
									chart2: "I_Step",
									chart3: "VIN",
									chart4: "FSP_Entry"
								},
								value_fields: {
									chart1: "Occurences",
									chart2: "Checkins",
									chart3: "KM_Driven",
									chart4: "Checkins"
								}
							});
						});
					});
				});
				
			}
		);
	}}));

	api.get("/filters", wagner.invoke(function(db){
		return function(req, res){
			db.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
			  if (error) throw error;
			  res.json({message: 'The solution is: ' + results[0].solution});
			}
		);
	}}));

	return api;
}