const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []

const isValid = (username)=>{ 
    var nameRegex = /^[a-zA-Z\-]+$/;
    return nameRegex.test(username);
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }

  //In the post man use /customer/login
//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
   if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

//In the post man use /customer/auth/review/:isbn
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let book = books[isbn]
   // res.send(isbn)
    if (book) { //Check is friend exists
        let author = req.body.author;
        let title = req.body.title;
        let reviews = req.body.reviews;
        
        if(reviews) {
            book["reviews"] = reviews
        }
        
        books[author]=book;
        books[title]=book;
        books[reviews]=book;
        res.send(`Book review is updated to` + reviews);
    }
    else{
        res.send("Unable to find Book!");
    }
});


//In the post man use /customer/auth/review/:isbn
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let book = books[isbn]
    let reviews = req.body.reviews;
    if (reviews){
        delete book[reviews]
    }
    res.send(`book with the review  ${reviews} is deleted.`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
