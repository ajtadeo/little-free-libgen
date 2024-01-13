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

/* USER SCHEMA AND MODEL */
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    points: { type: Number, default: 0 }
})

const User = mongoose.model("user", userSchema)

/* BOOK SCHEMA AND MODEL */
const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: String, requied: true },
})

const Book = mongoose.model("book", bookSchema);

/* ***************** API ENDPOINTS ***************** */

/* USER API */
app.post("/login", async function (req, res) {
    const { username, password } = req.body

    const user = await User.findOne({ username })

    if (user) {
        const loginValid = await bcrypt.compare(password, user.password)

        if (loginValid) {
            // correct password and username
            res.send(true)
        }
        else {
            // invalid password
            res.send(false)
        }
    }
    else {
        // invalid username
        res.send(false)
    }
})

app.post("/register", async function (req, res) {
    const { username, password } = req.body

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // create new user
    const newUser = new User({
        username,
        password: hashedPassword
    })

    // save new user to database
    try {
        let foundUser = await User.findOne({ username })
        if (foundUser == null) {
            try {
                await newUser.save()
                res.send(true)
            } catch (error) {
                res.send(error)
            }
        }
        else {
            res.send(false)
        }

    }
    catch (error) {
        res.send(error)
    }

})

app.post("/add-point", async function (req, res) {
    const { username } = req.body

    const foundUser = await User.findOne({ username })
    if (foundUser) {
        try {
            await User.findOneAndUpdate({ username }, { $inc: { points: 1 } })
            res.send(true)
        } catch (error) {
            res.send(error)
        }
    }
    else {
        res.send(false)
    }
})

app.get("/get-user-info", async function (req, res) {
    const { username } = req.body

    const foundUser = await User.findOne({ username }, 'username points')
    if (foundUser) {
        res.send(foundUser)
    }
    else {
        res.send(null)
    }
})

/* BOOK API */

app.get("/get-all-books", async function (req, res) {
    try {
        const books = await Book.find()
        res.send(books);
    } catch (error) {
        res.send(error);
    }
});

app.post("/add-book", async function (req, res) {
    // returns false if book already exists, true if added successfully

    const { title, author, isbn } = req.body

    const newBook = new Book({
        title,
        author,
        isbn
    })

    try {
        // see if book already exists
        let foundBook = await Book.findOne({ isbn })
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

app.post("/checkout", async function (req, res) {

    const { isbn } = req.body

    try {
        let foundBook = await Book.findOne({ isbn })
        if (foundBook == null) {
            res.send(false)
        }
        else {
            try {
                await Book.deleteOne({ isbn })
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

// const authRoutes = require('./routes/auth');
// app.use('/auth', authRoutes);
