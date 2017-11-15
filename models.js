var mysql = require('mysql');
var _ = require("underscore");

module.exports = function(wagner){

	var connection;

	function handleDisconnect() {

		connection = mysql.createConnection({
		  host     : '172.16.7.73', //'localhost',
		  user     : 'root',
		  password : 'dinesh',
		  database : 'bmw'
		});
		 
		connection.connect();
	                                          
		connection.on('error', function(err) {
			console.log('db error', err);
			if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
			  handleDisconnect();                         // lost due to either server restart, or a
			} else {                                      // connnection idle timeout (the wait_timeout
			  throw err;                                  // server variable configures this)
			}
		});
	}

	handleDisconnect();
	 
	wagner.factory("db", function(){	
		return connection;
	});
	 
	// connection.end();
}
