//import express module
var express = require("express");
//create an express app
var app = express();
//require express middleware body-parser
var bodyParser = require("body-parser");
//require express session
var session = require("express-session");
var cookieParser = require("cookie-parser");

//set the view engine to ejs
app.set("view engine", "ejs");
//set the directory of views
app.set("views", "./views");
//specify the path of static directory
app.use(express.static(__dirname + "/public"));

//use body parser to parse JSON and urlencoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//use cookie parser to parse request headers
app.use(cookieParser());
//use session to store user data between HTTP requests
app.use(
  session({
    secret: "cmpe_273_secure_string",
    resave: false,
    saveUninitialized: true,
  })
);

//Only user allowed is admin
var Users = [
  {
    username: "admin",
    password: "admin",
  },
];
//By Default we have 3 books
var books = [
  { BookID: "1", Title: "Book 1", Author: "Author 1" },
  { BookID: "2", Title: "Book 2", Author: "Author 2" },
  { BookID: "3", Title: "Book 3", Author: "Author 3" },
];

let bookfind = (id) => {
  let book = books.find((b) => b.BookID.toString() === id.toString());
  return book;
};
let intdef = (id) => {
  if (Number.isInteger(Number(id)) && Number(id) > 0) {
    return true;
  } else return false;
};
//route to root
app.get("/", function (req, res) {
  //check if user session exits
  if (req.session.user) {
    res.render("home", {
      books: books,
    });
  } else res.render("login");
});
app.get("/login", function (req, res) {
  if (req.session.user) {
    res.render("home", {
      books: books,
    });
  } else res.render("login");
});

app.post("/login", function (req, res) {
  if (req.session.user) {
    res.render("/home");
  } else {
    //console.log("Req Body : ", req.body);
    Users.filter((user) => {
      if (
        user.username === req.body.username &&
        user.password === req.body.password
      ) {
        req.session.user = user;
        res.redirect("/home");
      } else {
        let wronglogin = true;
        res.render("login", { wronglogin: wronglogin });
      }
    });
  }
});

app.get("/home", function (req, res) {
  if (!req.session.user) {
    res.redirect("/");
  } else {
    //console.log("Session data : ", req.session);
    res.render("home", {
      books: books,
    });
  }
});

app.get("/create", function (req, res) {
  if (!req.session.user) {
    res.redirect("/");
  } else {
    res.render("create");
  }
});

app.post("/create", function (req, res) {
  if (!req.session.user) {
    res.redirect("/");
    //console.log("invalid");
  } else {
    //console.log("entered");

    let iddef = intdef(req.body.id);
    //console.log(iddef);
    bfound = bookfind(req.body.id);
    if (iddef) {
      //console.log("inside of iddef");
      book = {
        BookID: req.body.id,
        Title: req.body.title,
        Author: req.body.author,
      };
      //console.log(req.body.id);

      //console.log(bfound);
      if (typeof bfound === "undefined") {
        //console.log("valid");
        books.push(book);
        res.render("home", {
          books: books,
        });
      } else {
        //console.log("invalid");
        res.render("create", { bfound: bfound });
      }
    } else {
      //let intdef = false;
      res.render("create", {
        bfound: bfound,
        iddef: iddef,
      });
    }
  }
});

app.get("/delete", function (req, res) {
  //console.log("Session Data : ", req.session.user);
  if (!req.session.user) {
    res.redirect("/");
  } else {
    res.render("delete");
  }
});

app.post("/delete", function (req, res) {
  if (!req.session.user) {
    res.redirect("/");
  } else {
    let book = bookfind(req.body.id);

    if (book) {
      let ind = books.indexOf(book);
      //console.log(ind);
      books.splice(ind, 1);
      res.render("home", { books: books });
    } else {
      res.render("delete", { book: book });
    }
  }
});

var server = app.listen(3000, function () {
  console.log("Server listening on port 3000");
});
