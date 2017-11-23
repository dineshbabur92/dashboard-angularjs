var mysql = require('mysql');
var _ = require("underscore");

module.exports = function(wagner){

	var connection;
	console.log(process.env.MARIADB_IP);
	function handleDisconnect() {

		connection = mysql.createConnection({
		  host     : process.env.MARIADB_IP, //'localhost',
		  // host     : "54.166.100.3",
		  // port: 9900,
		  user     : 'root',
		  password : 'dinesh',
		  database : 'bmw'
		});
		 
		connection.connect();
	                                          
		connection.on('error', function(err) {
			console.log('db error', err);
			// if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
		  	handleDisconnect();                         // lost due to either server restart, or a
			// } else {                                      // connnection idle timeout (the wait_timeout
			//   throw err;                                  // server variable configures this)
			// }
		});

		wagner.factory("db", function(){	
			return mysql.createPool({
		  // host     : process.env.MARIADB_IP, //'localhost',
		  connectionLimit: 100,
		  host     : "54.166.100.3",
		  port: 9900,
		  user     : 'root',
		  password : 'dinesh',
		  database : 'bmw'
		});
		});
	}

	handleDisconnect();
	 
	
	 
	// connection.end();
}
