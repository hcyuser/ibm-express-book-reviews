import express from 'express';
import jwt from 'jsonwebtoken';
import books from './booksdb.js';
import { jwtSecretKey } from '../config/config.js';
const authUserRouter = express.Router();

let users = [{"username": "username", "password": "password"}];

const isValid = (username)=>{ 
  //returns boolean
  const userMatches = users.filter((user) => user.username === username);
  return userMatches.length > 0;
}

const authenticatedUser = (username,password)=>{ 
  //returns boolean
  //write code to check if username and password match the one we have in records.
  const matchingUsers = users.filter((user) => user.username === username && user.password === password);
  return matchingUsers.length > 0;
}

//  Task 7
//  Only registered users can login
authUserRouter.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({data:password}, jwtSecretKey, {expiresIn: 3600});
    req.session.authorization = {accessToken,username};
    return res.status(200).send("User successfully logged in");
  }
  else {
    return res.status(208).json({message: "Invalid username or password"});
  }
});

//  Task 8
//  Add a book review
authUserRouter.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization.username;
  if (books[isbn]) {
    let book = books[isbn];
    book.reviews[username] = review;
    return res.status(200).send("Review successfully posted");
  }
  else {
      return res.status(404).json({message: `ISBN ${isbn} not found`});
  }
});

//  Task 9
//  Delete a book review
authUserRouter.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  if (books[isbn]) {
    let book = books[isbn];
    delete book.reviews[username];
    return res.status(200).send("Review successfully deleted");
  }
  else {
    return res.status(404).json({message: `ISBN ${isbn} not found`});
  }
});

export { authUserRouter, isValid, users };