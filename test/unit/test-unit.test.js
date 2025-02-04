const jwt = require("jsonwebtoken");
const jwtUtils = require("../../src/utils/jwtUtils");

describe("Verify token", () => {
  let token;
  let tokenInvalido
  beforeAll(() => {
    token = jwt.sign(JSON.stringify({ user: "user1" }), "supersecreto");
    tokenInvalido = jwt.sign(JSON.stringify({ user: "user1" }), "supersecretofalso");
  });

  it("token valido", (done) => {
    jwtUtils.verifyToken(token, (err, payload) => {
      expect(err).toBeNull();
      expect(payload).toStrictEqual({ user: "user1" });
      done()
    });
  });

  it("token invalido", (done) => {
    jwtUtils.verifyToken(tokenInvalido, (err, payload) => {
      expect(err).toBe("invalid signature")
      expect(payload).toBeNull()
      done()
    });
  });
});
