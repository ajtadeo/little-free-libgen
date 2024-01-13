const express = require("express");
const mongoose = require("mongoose");
const app = express()
const cors = require('cors')
const bcrypt = require('bcrypt');
const dotenv = require('dotenv')

dotenv.config()

// enable access to all origins
app.use(cors())

// allows for req.body to get Axios POST data
app.use(express.json())

main().catch(err => console.log(err));

// connect to mongoDB database
async function main() {
    mongoose.connect("mongodb+srv://root:root@libgenlibrary.iw0kaio.mongodb.net/library_db");
}


/* ***************** SCHEMAS AND MODELS ***************** */

/* BOOK SCHEMA AND MODEL */
const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: String }
})

const Book = mongoose.model("book", bookSchema);

/* ***************** API ENDPOINTS ***************** */

/* BOOK API */

app.get("/get-all-books", async function (req, res) {
    try {
        const books = await Book.find()
        res.send(books);
    } catch (error) {
        res.send(error);
    }
});

app.post("/add-book/:title/:author/:isbn", async function (req, res) {
    // returns false if book already exists, true if added successfully

    const newBook = new Book({
        title: req.params.title,
        author: req.params.author,
        isbn: req.params.isbn,
    })

    try {
        // see if book already exists
        let foundBook = await Book.findOne({ isbn: req.params.isbn })
        if (foundBook == null) {
            // if book doesn't exist, add new book
            try {
                await newBook.save()
                res.send(true)
            } catch (error) {
                res.send(error)
            }
        }
        else {
            // if book exists already, return false
            res.send(false)
        }

    }
    catch (error) {
        res.send(error)
    }

})

app.post("/checkout/:isbn", async function (req, res) {
    try {
        let foundBook = await Book.findOne({ isbn: req.params.isbn })
        if (foundBook == null) {
            res.send(false)
        }
        else {
            try {
                await Book.deleteOne({ isbn: req.params.isbn })
            }
            catch (error) {
                res.send(error)
            }
            res.send(true)
        }

    }
    catch (error) {
        res.send(error)
    }

})


app.listen(8000, function (req, res) {
    console.log("Listening on port 8000")
})

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);
