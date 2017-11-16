var express = require("express");
var bodyParser = require("body-parser");
var wagner = require("wagner-core");

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

wagner.factory("app", function(){
	return app;
});

require("./models")(wagner);

app.use(express.static(__dirname + '/client')) ;
app.use(express.static(__dirname + '/blur-admin')) ;
app.use("/", require("./api")(wagner));

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});

app.listen(8080);
console.log("app listening in 8080!");


