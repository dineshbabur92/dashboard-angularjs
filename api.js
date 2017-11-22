var bodyparser = require("body-parser");
var httpstatus = require("http-status");
var express = require("express");
var underscore = require("underscore");
var queries_base = require("./to_drive/data/queries_10days");
var mysql = require("mysql");

module.exports = function(wagner){

	api = express.Router();


	api.get("/", function(req, res){
		res.sendFile("/client/index.html");
		// res.json({message: "hello world!"});
	});

	api.get("/testing", function(req, res){
		res.sendFile(__dirname + "/blur-admin/src/index.html");
		// res.json({message: "hello world!"});
	});

	// fehlerspeicher.steuergeraet_sgbd
	// fehlerspeicher.fehler_ort_hex
	// fehlerspeicher.flag_ereignis_dtc
	// fehlerspeicher.fehlerspeicher_art
	// fahrzeugdaten.baureihe
	// fahrzeugdaten.fgnr 
	// fahrzeugdaten.I_stufe_ho
	// fehlerspeicher.auslese_datum
	// hour(fehlerspeicher.auslese_datum)

	var filterFieldMapping = {

		"SGBD": "fehlerspeicher.steuergeraet_sgbd",
		"FSP Hex Code": "fehlerspeicher.fehler_ort_hex",
		"IS DTC": "fehlerspeicher.flag_ereignis_dtc",
		"DTC Incident": "fehlerspeicher.fehlerspeicher_art",
		"Serie": "fahrzeugdaten.baureihe",
		"VIN": "fahrzeugdaten.fgnr",
		"I Step": "fahrzeugdaten.I_stufe_ho",
		"Date": "fehlerspeicher.auslese_datum",
		"Hour": "hour(fehlerspeicher.auslese_datum)",
		"FSP_Entry": "fehlerspeicher.fehler_ort_text",
		"I_Step": "SUBSTRING_INDEX(SUBSTRING_INDEX(fahrzeugdaten.I_stufe_ho, '-', 3),'-',-2)",
		"VIN": "fahrzeugdaten.fgnr"

	}

	function appendConditions(query, filters, fieldMapping){
		for(var i in filters){
			if(filters[i].length===0)
				continue;
			if(i==="Date" || i==="Hour"){
				query = query + " and " + fieldMapping[i] + " between " + (i==="Date" ? "'" : "") + filters[i][0] + (i==="Date" ? "'" : "") + " and "  + (i==="Date" ? "'" : "") + filters[i][1] + (i==="Date" ? "'" : "");
				continue;
			}
			query_values = "";
			for(var j in filters[i]){
				if(j==0){
					query_values = "'" + filters[i][j] + "'";
					continue;
				}
				query_values += ",'" + filters[i][j] + "'";
				// query_values += "," + i=="IS DTC" ? "'" : ""  + filters[i][j] + i=="IS DTC" ? "'" : "";
			}
			query = query + " and " + fieldMapping[i] + " in (" + query_values + ")"
		}
		// console.log(query);
		return query;
	}
	
	api.post("/report/:chart", wagner.invoke(function(db){

		return function(req, res){
			console.log("req param: ", req.params.chart);
			var chart = req.params.chart;
			var query = queries_base[chart];
			if(chart==="chart5")
			{
				query =  query[0] + appendConditions(query[1], {
						"Date": req.body.filters["Date"] ? req.body.filters["Date"] : [], 
						"Hour": req.body.filters["Hour"] ? req.body.filters["Hour"] : []
					}, filterFieldMapping);
			}
			else
				query = query[0] + appendConditions(query[1], req.body.filters, filterFieldMapping) + query[2];

			var all_results = {};
			// let conn = mysql.createConnection(db);
			db.getConnection(function(error, conn){
				if(error){
					console.log("error", error);
					throw error;
				}
				console.log("connected for ", chart);
				conn.query(query, function (error, results, fields) {
				// console.log("chart1 error: "+ error + "chart1 results: " + results);
					if (error){
						console.log(error);
						res.json({error: error});
						return;
					}
					all_results[chart] = results;
					// console.log(all_results);
					conn.release();
					res.json({
						results: all_results,
						titles: {
							chart1: "Top 20 FSP-Einträge pro 1000 KM",
							chart2: "Aktuelle I-Stufe Verteilung(KW 40)",
							chart3: "Top 10 gefahrene KM",
							chart4: "Single Event Fehlerspeicher"
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
							chart4: "Checkins",
						}
					});
				});
			});
			// console.log("Querying for chart 1: " + queries.chart1);
		}}
	));

	api.get("/filters", wagner.invoke(function(db){
		return function(req, res){
			var filters = {
				// "SGBD": ["foo1", "foo2"],
				// "FSP Hex Code": ["foo1", "foo2"],
				// "IS DTC": ["foo1", "foo2"],
				// "DTC Incident": ["foo1", "foo2"],
				// "Serie": ["foo1", "foo2"],
				// "VIN": ["foo1", "foo2"],
				// "I Step": ["foo1", "foo2"]
			}
			// let conn1 = mysql.createConnection(db);
			db.getConnection(function(error, conn){
				if(error){
					console.log("error", error);
					throw error;
				}
				conn.query("select filter_json from filters", function (error, results, fields) {
					if (error){
						console.log(error);
						res.json({error: error});
						return;
					}
					conn.release();
					res.json({filters: JSON.parse(results[0].filter_json)});
				});
			});
	}}));

	return api;
}