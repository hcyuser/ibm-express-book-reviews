import express from 'express';
import books from './booksdb.js';
import { users } from './auth_users.js';
const generalUserRoute = express.Router();

//  Task 6
//  Register a new user
generalUserRoute.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    if (users.find((user) => user.username === username)) {
        return res.status(409).json({ message: "Username already exists" });
    }
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});

//  Task 10
// Get book lists
const getBooks = () => {
    return new Promise((resolve) => {
        resolve(books);
    });
};

//  Task 1
//  Get the book list available in the shop
generalUserRoute.get('/', async (req, res) => {
    try {
        const bookList = await getBooks();
        res.json(bookList); // Neatly format JSON output
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book list" });
    }
});

//  Task 11
// Get book details based on ISBN
const getByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
        let isbnNum = parseInt(isbn);
        if (books[isbnNum]) {
            resolve(books[isbnNum]);
        } else {
            reject({ status: 404, message: `ISBN ${isbn} not found` });
        }
    });
};

//  Task 2
//  Get book details based on ISBN
generalUserRoute.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const book = await getByISBN(isbn);
        res.json(book);
    } catch (error) {
        res.status(error.status).json({ message: error.message });
    }
});

//  Task 3 & Task 12
//  Get book details based on author
const getByAuthor = (author) => {
    return new Promise((resolve, reject) => {
        const filteredBooks = Object.values(books).filter(book => book.author === author);
        if(filteredBooks.length > 0) {
            resolve(filteredBooks);
        } else {
            reject({ status: 404, message: `Author ${author} not found` });
        }
    });
};
generalUserRoute.get('/author/:author', async (req, res) => {
    const author = req.params.author;

    try {
        const books = await getByAuthor(author);
        res.json(books);
    } catch (error) {
        res.status(error.status).json({ message: error.message });
    }
});

//  Task 4 & Task 12
//  Get all books based on title
const getByTitle = (title) => {
    return new Promise((resolve, reject) => {
        const filteredBooks = Object.values(books).filter(book => book.title === title);
        if(filteredBooks.length > 0) {
            resolve(filteredBooks);
        } else {
            reject({ status: 404, message: `Author ${author} not found` });
        }
    });
};

generalUserRoute.get('/title/:title', async (req, res) => {
    const title = req.params.title;

    try {
        const books = await getByTitle(title);
        res.json(books);
    } catch (error) {
        res.status(error.status).json({ message: error.message });
    }

});

//  Task 5 & Task 13
//  Get book review
generalUserRoute.get('/review/:isbn', async (req, res) => {
    const isbn = req.params.isbn;

    try {
        const book = await getByISBN(isbn);
        res.json(book.reviews);

    } catch (error) {
        res.status(error.status).json({ message: error.message });
    }
});

export { generalUserRoute };
