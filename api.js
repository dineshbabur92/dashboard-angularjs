var bodyparser = require("body-parser");
var httpstatus = require("http-status");
var express = require("express");
var underscore = require("underscore");
var queries_base = require("./to_drive/data/queries_final");
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

        "SGBD": {
            "column_name": "steuergeraet_sgbd",
            "apply_in_positions":{
                "chart1":[1,3],
                "chart2":[1],
                "chart3":[1],
                "chart4":[1],
                "chart5":[1]
            }
        },
        "FSP Hex Code": {
            "column_name": "fehler_ort_hex",
            "apply_in_positions":{
                "chart1":[1,3],
                "chart2":[1],
                "chart3":[1],
                "chart4":[1],
                "chart5":[1]
            }
        },
        "IS DTC": {
            "column_name": "flag_ereignis_dtc",
            "apply_in_positions":{
                "chart1":[1,3],
                "chart2":[1],
                "chart3":[1],
                "chart4":[1],
                "chart5":[1]
            }
        },
        "DTC Incident": {
            "column_name": "fehlerspeicher_art",
            "apply_in_positions":{
                "chart1":[1,3],
                "chart2":[1],
                "chart3":[1],
                "chart4":[1],
                "chart5":[1]
            }
        },
        "Serie": {
            "column_name": "baureihe",
            "apply_in_positions":{
                "chart1":[1,3],
                "chart2":[1],
                "chart3":[1],
                "chart4":[1],
                "chart5":[1]
            }
        },
        "VIN": {
            "column_name": "fgnr",
            "apply_in_positions":{
                "chart1":[1,3],
                "chart2":[1],
                "chart3":[1],
                "chart4":[1],
                "chart5":[1]
            }
        },
        "I Step": {
            "column_name": "I_stufe_ho",
            "apply_in_positions":{
                "chart1":[1,3],
                "chart2":[1],
                "chart3":[1],
                "chart4":[1],
                "chart5":[1]
            }
        },
        "Date": {
            "column_name": "auslese_datum",
            "apply_in_positions":{
                "chart1":[1,3],
                "chart2":[1],
                "chart3":[1],
                "chart4":[1],
                "chart5":[1]
            }
        },
        "Hour": {
            "column_name": "hour(auslese_datum)",
            "apply_in_positions":{
                "chart1":[1,3],
                "chart2":[1],
                "chart3":[1],
                "chart4":[1],
                "chart5":[1]
            }
        },
        "FSP_Entry": {
            "column_name": "fehler_ort_text",
            "apply_in_positions":{
                "chart1":[1,3],
                "chart2":[1],
                "chart3":[1],
                "chart4":[1],
                "chart5":[1]
            }
        },
        "I_Step": {
            "column_name": "i_step",
            "apply_in_positions":{
                "chart1":[1,3],
                "chart2":[1],
                "chart3":[1],
                "chart4":[1],
                "chart5":[1]
            }
        }
    }


    function getQuery(chart, filters){

        // chart = "chart1";
        // filters = {"DTC Incident": ["F", "I"], "FSP Hex Code": ["0xCD0420"], "VIN": ["123", "456"]};
        let query = queries_base[chart].slice();

        for(var i in filters){
            if(filters[i].length===0)
                continue;
            if(i==="Date" || i==="Hour"){
                query = query + " and " + filterFieldMapping[i]["column_name"] + " between " + (i==="Date" ? "'" : "") + filters[i][0] + (i==="Date" ? "'" : "") + " and "  + (i==="Date" ? "'" : "") + filters[i][1] + (i==="Date" ? "'" : "");
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
            apply_in_positions = filterFieldMapping[i]["apply_in_positions"][chart];
            for(var k in apply_in_positions){
                query[apply_in_positions[k]] = query[apply_in_positions[k]] + " and " + filterFieldMapping[i]["column_name"] + " in (" + query_values + ")"
            }
        }
        // console.log(query);
        return query.join('');
    }
    
    api.post("/report/:chart", wagner.invoke(function(db){

        return function(req, res){
            console.log("req param: ", req.params.chart);
            let chart = req.params.chart;
            let query = getQuery(chart, req.body.filters);
            // if(chart==="chart5")
            // {
            //     query =  query[0] + appendConditions(query[1], {
            //             "Date": req.body.filters["Date"] ? req.body.filters["Date"] : [], 
            //             "Hour": req.body.filters["Hour"] ? req.body.filters["Hour"] : []
            //         }, filterFieldMapping);
            // }
            // else if(chart==="chart3"){
            //     query = query[0] + appendConditions(query[1], req.body.filters, filterFieldMapping_3) + query[2];

            // }
            // else
            //     query = query[0] + appendConditions(query[1], req.body.filters, filterFieldMapping) + query[2];

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
