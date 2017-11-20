var pg = require('pg');
var conString = "postgres://ebaymaster:Welcome123@lvcluster.cfs39rhwb5az.ap-southeast-1.redshift.amazonaws.com:5439/sqltestdb";
var client = new pg.Client(conString);

module.exports = function(wagner) {
  return new Promise((resolve, reject) => {
    client.connect(function(err) {
      if(err) {
        return console.error('could not connect to postgres', err);
      }
      wagner.factory("db", function(){
        return client;
      });
      resolve(1);
    });
  });
}

// redshiftConnect().then((status) => { console.log("connected"); });

// status.connect = client.connect(function(err) {
//     if(err) {
//       return console.error('could not connect to postgres', err);
//     }
//     status.connect = true;
//     client.query("select top 1 * from bmw.checkins", function(err, results){console.log(results);});
    
//   });

// while(!status.connect){
//   console.log(status.connect)
// }

// console.log(status.connect);
