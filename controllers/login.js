exports.get = function(request, response, db) {
    let msg = { username: "", password: "" };
    let username;
    let password;
    if (request.body.name == 'joe'){
      msg.username = "correct";
    }else{
      msg.username = "incorrect";
    }
    if (request.body.password == 'sesame'){
      msg.password = "correct";
    }else{
      msg.password = "incorrect";
    }
    if (msg.username == 'correct' && msg.password == 'correct'){
        response.cookie('spongebob', 'squarepants').send(JSON.stringify(msg));
    } else {
    response.send(JSON.stringify(msg));
    }
}