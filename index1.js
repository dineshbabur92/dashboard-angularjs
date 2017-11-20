var express = require("express");
var bodyParser = require("body-parser");
var wagner = require("wagner-core");
var logger = require('morgan');
var fs = require("fs");

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/client')) ;

wagner.factory("app", function(){
	return app;
});

require("./models3")(wagner).then(function(status){
	console.log("db connect status", status);
	app.use("/", require("./api")(wagner));
	app.listen(8080);
});




// setInterval(wagner.invoke(function(db){
//     return function(){
//     	console.log("keeping the connection alive");
//     	db.query('SELECT 1');
// 	}
// }), 10000);

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});



// var accessLogStream = fs.createWriteStream(
//       __dirname +  '/access.log', {flags: 'w'}
//  );
// // setup the logger 
// app.use(logger('combined', {stream: accessLogStream}));


console.log("app listening in 8080!");


