const jwtUtils = require("../utils/jwtUtils");

module.exports = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    res.status(401).send(`unauthorized. Go to <a href="/login">login</login>`);
    return;
  }

  jwtUtils.verifyToken(token, (err, payload) => {
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
