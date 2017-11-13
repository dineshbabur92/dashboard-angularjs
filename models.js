var mysql = require('mysql');
var _ = require("underscore");

module.exports = function(wagner){

	var connection = mysql.createConnection({
	  host     : '172.16.7.73', //'localhost',
	  user     : 'root',
	  password : 'dinesh',
	  database : 'bmw'
	});
	 
	connection.connect();
	 
	wagner.factory("db", function(){	
		return connection;
	});
	 
	// connection.end();
}