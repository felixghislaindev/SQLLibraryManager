// requiring express
const express = require("express");
const router = express.Router();

// sequelize operators
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

// requiring method override which will help when doing update and delete as
//html only supports put Get and Post request
const methoOverride = require("method-override");
// requiring body parder form forms
const bodyParser = require("body-parser");

// importing the book model
const Book = require("../models").Book;

// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));

// passing data as json
router.use(bodyParser.json());

// using methid override
router.use(methoOverride("_method"));

// home route
router.get("/", (req, res) => {
  res.redirect("/books");
});
// show full book list
router.get("/books", (req, res) => {
  Book.findAll().then(books => {
    res.render("index", { books: books });
  });
});
// create book
router.get("/books/new", (req, res) => {
  res.render("new-book");
});
// will post/push book to the database after creation
router.post("/books/new", (req, res) => {
  // creating and inserting book in the database

  Book.create(req.body)
    .then(book => res.redirect("/books"))
    .catch(err => {
      if (err.name === "SequelizeValidationError") {
        res.render("new-book", { errors: err.errors });
      } else {
        throw err;
      }
    });
});
// show book data form
router.get("/books/:id", (req, res, next) => {
  //   checking is id params is provided
  Book.findById(req.params.id)
    .then(book => {
      if (book) {
        res.render("update-book", { book: book });
      } else {
        res.render("error");
        res.redirect();
      }
    })
    .catch(err => res.send(500));
});
// update book
router.put("/books/:id", (req, res) => {
  // finding the book to update
  Book.findById(req.params.id)
    // updating the book
    .then(book => {
      if (book) {
        return book.update(req.body);
      } else {
        res.send(500);
      }
    })
    .then((
      book // redirecting to the main page
    ) => res.redirect("/books"))
    .catch(err => {
      // testing the error and sending back the form with the error msg
      if (err.name === "SequelizeValidationError") {
        var book = Book.build(req.body);
        book.id = req.params.id;
        res.render("update-book", { book: book, errors: err.errors });
      } else {
        throw err;
      }
    })
    .catch(err => res.send(500));
});

// delete book
router.delete("/books/:id", (req, res) => {
  // find the book to be deleted
  Book.findById(req.params.id)
    .then(book => book.destroy())
    .then(() => res.redirect("/"));
});

// searching functionality
router.post("/books/search", (req, res) => {
  // capitilizing first letter since or data as capatilize fist letter for all rows
  const searchWord =
    req.body.search.charAt(0).toUpperCase() + req.body.search.slice(1);
  Book.findAll({
    where: {
      [Op.or]: [
        { title: searchWord },
        { author: searchWord },
        { genre: searchWord },
        { year: searchWord }
      ]
    }
  }).then(books => {
    if (books.length !== 0) {
      res.render("index", { books: books });
    } else {
      res.render("not-found", { title: "Book, Author , Genre or Year" });
    }
  });
});

module.exports = router;
