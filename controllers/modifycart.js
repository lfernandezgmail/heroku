exports.get = function(request, response, db) {
  
  var selected;
  if ( request.body.modify == 'add'){
    selected = 1;
  }else{
    selected = 0;
  }
  
  var sqlStatement = 'UPDATE books SET selected =' + selected + ' WHERE isbn =' + request.body.isbn ; 
  
  db.serialize(function() {
      db.run(sqlStatement);
  });
  
  var myOb = {"Success" : "true"};
  response.json(myOb);
}