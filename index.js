const express = require("express");
const PORT = process.env.PORT || 8007;
const app = express();
const { v4: uuid } = require("uuid");
const fs = require("fs/promises");
// Don't worry about these 4 lines below
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


app.get("/", (req, res) => {
  res.render("createcard");
});

app.post("/", async (req, res) => {
  const data = req.body;
  data.id = uuid().substring(0, 5);
  //react database.json

  //filter that values equeal to 'on'
  let knownTechnologies = Object.entries(data).filter(([key, value]) => {
    if (value === "on") {
      delete data[key];
      return true;
    }
  }).map(item => item[0]);
  data.knownTechnologies = knownTechnologies;
  data.favoriteBooks = data.books.split(",");
  delete data.books;
  data.favoriteArtists = data.artists.split(",");
  delete data.artists;

  try {
    let db = JSON.parse(await fs.readFile("database.json", "utf8")).users;
    console.log(db);
    db.push(data);
    await fs.writeFile("database.json", JSON.stringify({ users: db }));
    res.redirect("/people/"+data.id);
  } catch (error) {
    console.log(error);
  }
})

app.get("/people/:id", async (req, res) => {
  let id = req.params.id;
  let db = JSON.parse(await fs.readFile("database.json", "utf8")).users;
  let person = db.find(person => person.id === id);
  res.render("people", { person });
});


app.get("/:id/photos", (req, res) => {
  const id = req.params.id;
});

app.listen(PORT, () => {
  console.log(`Server now is running at http://localhost:${PORT} 🚀`);
});
