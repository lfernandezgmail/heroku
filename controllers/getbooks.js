exports.get = function(request, response, db) {

db.all('SELECT * from Books', function(err, rows) {
    console.log(rows);
    response.send(JSON.stringify(rows));
  });
  
}