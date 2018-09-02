exports.get = function(request, response, db) {


db.all('SELECT * from Books where selected=1', function(err, rows) {
    console.log(rows);
    response.send(JSON.stringify(rows));
  });
  
}