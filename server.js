// server.js
// where your node app starts

// init project
var express = require('express');


var cookieParser = require('cookie-parser');

var app = express();
app.use(cookieParser());


// Enable CORS (see https://enable-cors.org/server_expressjs.html)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//see https://stackoverflow.com/questions/5710358/how-to-retrieve-post-query-parameters
app.use(express.json());       // to support JSON-encoded bodies

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use('/private', express.static('private'));

//init sqlite db
var fs = require('fs');
var dbFile = './.data/sqlite.db';
var exists = fs.existsSync(dbFile);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbFile);

// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
db.serialize(function(){
  if (!exists) {
    db.run('DROP TABLE IF EXISTS Books');
    db.run('CREATE TABLE Books (author TEXT,title TEXT, isbn INTEGER, selected INTEGER)');
    console.log('New table Books created!');
    
    // insert default books
    db.serialize(function() {
      db.run('INSERT INTO Books (author,title,isbn, selected) VALUES ("Mary Shelly","Frankenstein","1", "0")');
      db.run('INSERT INTO Books (author,title,isbn, selected) VALUES ("John Stewart Mill","On Liberty","2", "0")');
      db.run('INSERT INTO Books (author,title,isbn, selected) VALUES ("Max Weber","The Protestant Ethic and the Spirit of Capitalism","3", "0")');
      db.run('INSERT INTO Books (author,title,isbn, selected) VALUES ("Karl Marx","The Communist Manifesto","4", "0")');
    });
  } else{
    console.log('Database "Books" ready to go!');
    db.each('SELECT * from Books', function(err, row) {
      if ( row ) {
        console.log('record:', row);
      }
    });
  }
});

//begin core routes used in app

app.all('/private/*', function(request, response, next) {
  if (request.cookies.spongebob == 'squarepants'){
    next();
  }else{
    response.redirect("/unauthorized");
  }
})

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/logout', function(request, response) {
  response.clearCookie("spongebob");
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/private/selectproducts', function(request, response) {
  response.sendFile(__dirname + '/private/selectproducts.html');
});

app.get('/private/cart', function(request, response) {
  response.sendFile(__dirname + '/private/cart.html');
});

app.get('/unauthorized', function(request, response) {
  response.sendFile(__dirname + '/views/unauthorized.html');
});

app.post('/login', function(request, response) {
  require(__dirname + '/controllers/login').get(request,response,db);
});

app.get('/getbooks', function(request, response) {
  require(__dirname + '/controllers/getbooks').get(request,response,db);
});

app.get('/getcart', function(request, response) {
  require(__dirname + '/controllers/getcart').get(request,response,db);
});

app.post('/modifycart', function(request, response) {
  require(__dirname + '/controllers/modifycart').get(request,response,db);
});


//end core routes used in app

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
