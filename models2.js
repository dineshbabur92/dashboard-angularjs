//redshift.js 
var Redshift = require('node-redshift');
 
var client = {
  user: "ebaymaster",
  database: "sqltestdb",
  password: "Welcome123",
  port: 5439,
  host: "jdbc:redshift://lvcluster.cfs39rhwb5az.ap-southeast-1.redshift.amazonaws.com",
};
 
// The values passed in to the options object will be the difference between a connection pool and raw connection 
var redshiftClient = new Redshift(client, []);

redshiftClient.connect(function(err){
  if(err) throw err;
  else{
    redshiftClient.query('SELECT top 1 * from bmw.checkins', [] , function(err, data){
      if(err) throw err;
      else{
        console.log(data);
        redshiftClient.close();
      }
    });
  }
});

 
module.exports = redshiftClient;