var mysql = require('mysql');
var _ = require("underscore");

module.exports = function(wagner){

	var connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : '',
	  database : 'bmw'
	});
	 
	connection.connect();
	 
	wagner.factory("db", function(){	
		return connection;
	});
	 
	// connection.end();
}