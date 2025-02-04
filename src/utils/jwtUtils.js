const jwt = require("jsonwebtoken");

function verifyToken(token, cb) {
  jwt.verify(token, "supersecreto", (err, payload) => {
    if (err) {
      cb(err.message, null);
      return;
    }

    cb(null, payload);
  });
}

module.exports = {
  verifyToken,
};
