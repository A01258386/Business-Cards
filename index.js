const { request } = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const path = require("path");
const express = require("express");
const PORT = process.env.PORT || 8007;
const app = express();
const fs = require("fs");

// Don't worry about these 4 lines below
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(expressLayouts);

app.use((req, res, next) => {
  res.locals = ({
    user: req.user || null,
  });
  next()
});

app.use(express.static(__dirname + '/public'));

app.get("/people/:id", (req, res) => {
  res.render("people");
});

app.get("/homepage", (req, res) => {
  res.render("homepage");
});


//write the id to the database.json file users

//read database.json file

app.get("/:id", (req, res) => {
  const id = req.params.id;
  const data = fs.readFileSync("./database.json");
  const jsonData = JSON.parse(data);
  const user = jsonData.users.find(user => user.id === id);
  res.render("profile", { user });
});

//write to json file
app.post("/:id", (req, res) => {
  const id = req.params.id;
  const data = fs.readFileSync("./database.json");
  const jsonData = JSON.parse(data);
  const user = jsonData.users.find(user => user.id === id);
  user.fullName = req.body.fullName;
  user.aboutMe = req.body.aboutMe;
  user.knownTechnologies = req.body.knownTechnologies;
  fs.writeFileSync("./database.json", JSON.stringify(jsonData));
  res.redirect(`/${id}`);
});



app.listen(PORT, () => {
  console.log(`Server now is running at http://localhost:${PORT} 🚀`);
});



// ejs
// request.params
// fs.writefile
