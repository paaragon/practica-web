const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    res.status(401).send(`unauthorized. Go to <a href="/login">login</login>`);
    return;
  }

  jwt.verify(token, "supersecreto", (err, payload) => {
    if (err) {
      res
        .status(401)
        .send(`unauthorized. Go to <a href="/login">login</login>`);
      return;
    }

    req.payload = payload;
    next();
  });
};
