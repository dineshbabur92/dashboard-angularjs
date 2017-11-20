var jdbc = new ( require('jdbc') );
// var config = {
//   url: 'D:/Data/Dinesh/Programs/RedshiftJDBC41-1.1.10.1010.jar',
//   //libs: [__dirname + 'path/to/other/jars.jar'],
//   drivername: 'com.amazon.redshift.jdbc41.Driver',
//   url: 'jdbc:redshift://lvcluster.cfs39rhwb5az.ap-southeast-1.redshift.amazonaws.com:5439/sqltestdb',
//   properties: [
//     ['user', 'ebaymaster'],
//     ['password', 'Welcome123']
//   ]
// };

var config = {
  url: 'jdbc:redshift://lvcluster.cfs39rhwb5az.ap-southeast-1.redshift.amazonaws.com:5439/sqltestdb',
  user : 'ebaymaster',
  password: 'Welcome123',
  minpoolsize: 2,
  maxpoolsize: 3
};

jdbc.initialize(config, function(err, res) {
    if (err) {
    console.log(err);
  }
});

var genericQueryHandler = function(err, results) { 
    if (err) {
        console.log(err);
    } 
    else if (results) {
        console.log(results);
    }

  jdbc.close(function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("Connection closed successfully!");
    }
  });
};

jdbc.open(function(err, conn) {
if (conn) {
     // SELECT statements are called with executeQuery 
     jdbc.executeQuery("select * from information_schema.tables", genericQueryHandler);
}
});