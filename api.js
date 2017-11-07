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
			console.log(req.params);
			var chart_query = " \
				select \
					a.fehler_ort_text, \
					count(b.checkin_id) as checkins_count \
				from fehlerspeicher a \
					inner join checkins b \
					on a.checkin_id = b.checkin_id \
				group by 1 \
				order by count(b.checkin_id) desc \
				limit 0,20; \
			";
			db.query(chart_query, function (error, results, fields) {
				if (error) throw error;
				console.log(results[0]);
				res.json({
					data: results,
					title: "Top 20 FSP Entries per 1000 KM",
					category_field: "fehler_ort_text",
					value_field: "checkins_count"
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