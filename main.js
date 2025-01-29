const path = require("path");
const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const authGuard = require("./middlewares/authGuard");
const cochesRepo = require("./repositories/coches-repository");

const viewsDir = path.join(__dirname, "views");
const app = express();
app.set("view engine", "ejs");
app.set("views", viewsDir);
app.use(express.json());
app.use(cookieParser());
app.use(cors());
const PORT = 8080;
app.use(express.static(viewsDir));

let db;
(async () => {
  db = await open({
    filename: path.join(__dirname, "database.db"),
    driver: sqlite3.Database,
  });

  await db.run(`
    CREATE TABLE IF NOT EXISTS coches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        marca TEXT NOT NULL,
        MODELO TEXT NOT NULL,
        MATRICULA TEXT
    )
    `);
})();

app.post("/api/login", (req, res) => {
  const body = req.body;
  const username = body.username;
  const password = body.password;

  if (username === "user1" && password === "user1") {
    const token = jwt.sign(JSON.stringify({ user: username }), "supersecreto");

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000, // 1h
    });

    res.json({ message: "login successful" });
    return;
  }

  res.status(401).json({ message: "invalid credentials" });
});

app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Compra y vende tu coche</h1>
    <p>En esta web podrás comprar y vender tus coches</p>
    <ul>
        <li><a href="comprar-coche">Comprar coche</a></li>
        <li><a href="vender-coche">Vender coche</a></li>
    </ul>
</body>
</html>`);
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(viewsDir, "login.html"));
});

app.get("/comprar-coche", authGuard, async (req, res) => {
  const coches = await cochesRepo.getCoches(db);
  console.log(coches)
  res.render("comprar-coche", { ...req.payload, coches });
});

app.get("/vender-coche", authGuard, (req, res) => {
  res.sendFile(path.join(viewsDir, "vender-coche.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
