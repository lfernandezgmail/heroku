// client-side js
// run by the browser each time your view template referencing it is loaded

console.log('hello world :o');

function deleteAllCookies() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    alert("Cookies deleted!");
}

function showCookie(){
 alert(document.cookie); 
}

function login(){
  //create the javascript object from the form
  var user = new Object();
  user.name = document.getElementById('username').value;
  user.password = document.getElementById('password').value;

  fetch('/login',{
    method: "POST",
    headers: {'Content-Type':'application/json', 'Access-Control-Origin': '*'},
    body:  JSON.stringify(user),
    //credentials: "same-origin"
    credentials: "include"
  })
  .then((response) => {
     return response.json();
  })
  .then((resp) => {
    message('something is returned....');
    document.getElementById('usernameMsg').innerHTML = resp.username;
    document.getElementById('passwordMsg').innerHTML = resp.password;
    if (resp.username == 'correct' && resp.password == 'correct'){
      message('Hello ' + document.getElementById('username').value + "! Standby while we log you in...");
      setTimeout(function(){ window.location.href = "/private/selectproducts"; }, 3000); 
    }
  })
  .catch((err) => {
    // Code called when an error occurs during the request
    document.getElementById('message').innerHTML ='Error: ' + err.message;
  });

}

function getBooks(){
  message('Getting Books...');
  fetch('/getbooks')
  .then((response) => {
     return response.json();
  })
  .then((books) => {
    displayBooks(books);
    message('');
  })
  .catch((err) => {
    // Code called when an error occurs during the request
    alert('Error: ' + err.message);
  });
}

function displayBooks(books){
   document.getElementById('books').innerHTML = "";
   if (books.length == 0){
     document.getElementById('books').innerHTML='No books in DB';
   } else
   {
     var bookTable = "<table><thead><tr><th>&#10004;<br>(checked items in cart)</th><th>Author</th><th>Title</th></tr></thead><tbody>";
     var selectedVar;
     for(var i=0;i < books.length;i++){         
         if (books[i].selected == 1){
           selectedVar = "&#10004;";
         }else{
           selectedVar = "";
         }
         bookTable = bookTable + "<tr onclick='modifyCart(this)' id='" + books[i].isbn    + "'><td>" + selectedVar  + "</td><td>" + books[i].author +"</td><td>" + books[i].title + "</td></tr>"; 
     }
     bookTable = bookTable + "</tbody></table>";
     document.getElementById('books').innerHTML = bookTable;
   }
}

function modifyCart(element){
  
  var cartMessage = { isbn : "" , modify : ""};
  cartMessage.isbn = element.id;

  if (element.cells[0].innerHTML == ""){
     cartMessage.modify = "add";
     element.cells[0].innerHTML= "&#10004;";
  }else{
     cartMessage.modify = "remove";
     element.cells[0].innerHTML= "";
  }
 
  fetch('/modifycart',{
    method: "POST",
    headers: {'Content-Type':'application/json', 'Access-Control-Origin': '*'},
    body:  JSON.stringify(cartMessage),
    //credentials: "same-origin"
    credentials: "include"
  })
  .then((response) => {
     return response.json();
  })
  .then((resp) => {
    console.log(resp);
  })
  .catch((err) => {
    // Code called when an error occurs during the request
    document.getElementById('message').innerHTML ='Errorr: ' + err.message;
    console.log(err.message);
  });
  
}

function getCart(){
  message('Getting Books In Cart...');
  fetch('/getcart')
  .then((response) => {
     return response.json();
  })
  .then((books) => {
    displayCart(books);
    message('');
  })
  .catch((err) => {
    // Code called when an errors occurs during the request
    alert('Errorss: ' + err.message);
  });
}

function displayCart(books){
   document.getElementById('books').innerHTML = "";
   if (books.length == 0){
     document.getElementById('books').innerHTML='No books currently in shopping cart';
   } else
   {
     var bookTable = "<table><thead><tr><th>Author</th><th>Title</th></tr></thead><tbody>";
     var selectedVar;
     for(var i=0;i < books.length;i++){         
         if (books[i].selected == 1){
           selectedVar = "&#10004;";
         }else{
           selectedVar = "";
         }
         bookTable = bookTable + "<tr ><td>" + books[i].author  +"</td><td>" + books[i].title + "</td></tr>"; 
     }
     bookTable = bookTable + "</tbody></table>";
     document.getElementById('books').innerHTML = bookTable;
   }
}
      
function message(msg){
  document.getElementById('message').innerHTML = msg;

  var erase = function(){
    console.log('debug 22');
    document.getElementById('message').innerHTML = "";
  }
  setTimeout(erase, 3000);
  console.log('debug 33');
}

function logout(){
  deleteAllCookies();
  window.location.href = "/";
  
}