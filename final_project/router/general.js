const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!doesExist(username)) {
        if(!isValid(username)){
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } 
    }else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let myPromise = new Promise((resolve,reject) => {
        setTimeout(() => {
            res.send(JSON.stringify(books,null,4));
        },3000)})

    myPromise.then((successMessage) => {
            console.log("From Callback " + successMessage)
          })
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
 const isbn=req.params.isbn;
 let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
 res.send(books[isbn]);
},3000)})

myPromise.then((successMessage) => {
        console.log("From Callback " + successMessage)
      })

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let authorlist = [];
    let myPromise = new Promise((resolve,reject) => {
        setTimeout(() => {
    for (b in books) {
      if (books[b].author === author){
       
        authorlist.push(books[b]);
      }
    }
    res.send(JSON.stringify(authorlist, null, 2));
},3000)})

    myPromise.then((successMessage) => {
        console.log("From Callback " + successMessage)
      })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title=req.params.title;
  let titlelist = [];
  let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
  for (b in books) {
    if (books[b].title === title){
     
        titlelist.push(books[b]);
    }
  }
  res.send(JSON.stringify(titlelist, null, 2));
},3000)})

myPromise.then((successMessage) => {
    console.log("From Callback " + successMessage)
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn=req.params.isbn;
    let book =books[isbn];
    let reviews=book.reviews;
    res.send("The Review is " + reviews)
});

module.exports.general = public_users;
