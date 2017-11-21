var mysql = require('mysql');
var _ = require("underscore");

var connection;
var filters = {};
// console.log(process.env.MARIADB_IP);
function handleDisconnect() {

	connection = mysql.createConnection({
	  // host     : process.env.MARIADB_IP, //'localhost',
	  host     : "54.166.100.3",
	  port: 9900,
	  user     : 'root',
	  password : 'dinesh',
	  database : 'bmw'
	});
	 
	connection.connect(function(status){
		console.log("connected successfully");
		db = connection;
		// db.query("select steuergeraet_sgbd from fehlerspeicher limit 0,1", function (error, results, fields) {
		// 		if (error) throw error;
		// 		var values = [];
		// 		for(var i in results){
		// 			values.push(results[i].steuergeraet_sgbd);
		// 	  	}
		// 	  	filters["SGBD"] = values;
		// 	  	db.query("select distinct fehler_ort_hex from fehlerspeicher", function (error, results, fields) {
		// 			if (error) throw error;
		// 			var values = [];
		// 			for(var i in results){
		// 				values.push(results[i].fehler_ort_hex);
		// 			}
		// 			filters["FSP Hex Code"] = values;
		// 			db.query("select distinct flag_ereignis_dtc from fehlerspeicher", function (error, results, fields) {
		// 				if (error) throw error;
		// 				var values = [];
		// 				for(var i in results){
		// 					values.push(results[i].flag_ereignis_dtc);
		// 				}
		// 				filters["IS DTC"] = values;
		// 				db.query("select distinct fehlerspeicher_art from fehlerspeicher", function (error, results, fields) {
		// 					if (error) throw error;
		// 					var values = [];
		// 					for(var i in results){
		// 						values.push(results[i].fehlerspeicher_art);
		// 					}
		// 					filters["DTC Incident"] = values;
		// 					db.query("select distinct baureihe from fahrzeugdaten", function (error, results, fields) {
		// 						if (error) throw error;
		// 						var values = [];
		// 						for(var i in results){
		// 							values.push(results[i].baureihe);
		// 						}
		// 						filters["Serie"] = values;
		// 						db.query("select distinct fgnr from fahrzeugdaten", function (error, results, fields) {
		// 							if (error) throw error;
		// 							var values = [];
		// 							for(var i in results){
		// 								values.push(results[i].fgnr);
		// 							}
		// 							filters["VIN"] = values;
		// 							db.query("select distinct I_stufe_ho from fahrzeugdaten", function (error, results, fields) {
		// 								if (error) throw error;
		// 								var values = [];
		// 								for(var i in results){
		// 									values.push(results[i].I_stufe_ho);
		// 								}
		// 								filters["I Step"] = values;

		// 							  	db.query("insert into filters values (?)", JSON.stringify(filters), function(error, results, fields){
		// 							  		if(error){
		// 							  			console.log("error", error);
		// 							  			throw error;
		// 							  		}
		// 							  		else{
		// 							  			console.log("successful!");
		// 							  			console.log("results", results);
		// 							  		}
		// 							  	});
		// 							  	console.log("filters inserted", filters);
		// 							});
		// 						});
		// 					});
		// 				});
		// 			});
		// 		});
		// 	});

		db.query("select filter_json from filters", function (error, results, fields) {
			if (error) throw error;
			console.log({filters: JSON.parse(results[0].filter_json)});
		});
	});
                                          
	connection.on('error', function(err) {
		console.log('db error', err);
	  	handleDisconnect();     
	});

	// console.log("connected");
}

handleDisconnect();
