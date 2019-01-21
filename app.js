// requiring express
const express = require("express");

// requiring our model
const models = require("./models");
// port app will be listening to
const port = 3000;
//importing books routes
const bookRoutes = require("./routes/books");
// creating the apllication
const app = express();

// serving static files css from the public folder
app.use("/static", express.static("public"));
// setting up template view for the app
app.set("view engine", "pug");

// books routes
app.use("/", bookRoutes);

// handling 404
app.use((req, res, next) => {
  res.status(404).render("not-found", { title: "page" });
});
// having the app listenning on port 3000
app.listen(port, () => console.log("Application running..."));
