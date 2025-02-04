const path = require("path");
const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authGuard = require("./middlewares/authGuard");
const cochesRepo = require("./repositories/coches-repository");
const db = require("./db");

const viewsDir = path.join(__dirname, "views");
const app = express();
app.set("view engine", "ejs");
app.set("views", viewsDir);
app.use(express.json());
app.use(cookieParser());
app.use(cors());
const PORT = 8080;
app.use(express.static(viewsDir));

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
  const dbClient = db.getDBClient();
  const coches = await cochesRepo.getCoches(dbClient);
  res.render("comprar-coches", { ...req.payload, coches });
});

app.get("/comprar-coche/:id", authGuard, async (req, res) => {
  const id = req.params.id;
  const dbClient = db.getDBClient();
  const coche = await cochesRepo.getCoche(dbClient, id);
  res.render("comprar-coche", { ...req.payload, coche });
});

app.get("/vender-coche", authGuard, (req, res) => {
  res.sendFile(path.join(viewsDir, "vender-coche.html"));
});

function startServer() {
  return new Promise((res, rej) => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      res();
    });
  });
}

module.exports = {
  startServer,
  app
};
