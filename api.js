var bodyparser = require("body-parser");
var httpstatus = require("http-status");
var express = require("express");
var underscore = require("underscore");
var queries_base = require("./to_drive/data/queries");
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
		"Hour": "hour(fehlerspeicher.auslese_datum)"

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
			}
			query = query + " and " + fieldMapping[i] + " in (" + query_values + ")"
		}
		// console.log(query);
		return query;
	}
	
	api.post("/report", wagner.invoke(function(db){
		return function(req, res){
			var queries = {};
			for(var i in queries_base){
				queries[i] = queries_base[i];
			}
			for(var i in queries){
				if(i==="chart5")
				{
					queries[i] =  queries[i][0] + appendConditions(queries[i][1], {
							"Date": req.body.filters["Date"] ? req.body.filters["Date"] : [], 
							"Hour": req.body.filters["Hour"] ? req.body.filters["Hour"] : []
						}, filterFieldMapping);
					continue;
				}
				queries[i] = queries[i][0] + appendConditions(queries[i][1], req.body.filters, filterFieldMapping) + queries[i][2];
			}
			console.log(queries.chart5);
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
							db.query(queries.chart5, function (error, results, fields) {
								if (error){
									res.json({message: "chart5 error"});
									return;
								}
								all_results.chart5 = results;
								// console.log(all_results);
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
										chart4: "Checkins",
									}
								});
							});
						});
					});
				});
				
			}
		);
	}}));

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
			db.query("select distinct steuergeraet_sgbd from fehlerspeicher", function (error, results, fields) {
				if (error) throw error;
				var values = [];
				for(var i in results){
					values.push(results[i].steuergeraet_sgbd);
			  	}
			  	filters["SGBD"] = values;
			  	db.query("select distinct fehler_ort_hex from fehlerspeicher", function (error, results, fields) {
					if (error) throw error;
					var values = [];
					for(var i in results){
						values.push(results[i].fehler_ort_hex);
					}
					filters["FSP Hex Code"] = values;
					db.query("select distinct flag_ereignis_dtc from fehlerspeicher", function (error, results, fields) {
						if (error) throw error;
						var values = [];
						for(var i in results){
							values.push(results[i].flag_ereignis_dtc);
						}
						filters["IS DTC"] = values;
						db.query("select distinct fehlerspeicher_art from fehlerspeicher", function (error, results, fields) {
							if (error) throw error;
							var values = [];
							for(var i in results){
								values.push(results[i].fehlerspeicher_art);
							}
							filters["DTC Incident"] = values;
							db.query("select distinct baureihe from fahrzeugdaten", function (error, results, fields) {
								if (error) throw error;
								var values = [];
								for(var i in results){
									values.push(results[i].baureihe);
								}
								filters["Serie"] = values;
								db.query("select distinct fgnr from fahrzeugdaten", function (error, results, fields) {
									if (error) throw error;
									var values = [];
									for(var i in results){
										values.push(results[i].fgnr);
									}
									filters["VIN"] = values;
									db.query("select distinct I_stufe_ho from fahrzeugdaten", function (error, results, fields) {
										if (error) throw error;
										var values = [];
										for(var i in results){
											values.push(results[i].I_stufe_ho);
										}
										filters["I Step"] = values;
										res.json({filters: filters});
									});
								});
							});
						});
					});
				});
			});
	}}));

	return api;
}