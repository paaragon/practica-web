const request = require("supertest");
const jwt = require("jsonwebtoken");
const { app } = require("../../src/server");
const db = require("../../src/db");

describe("Autenticación", () => {
  it("autenticación errónea", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ username: "user", password: "user" });

    expect(res.statusCode).toBe(401);
  });

  it("autenticación con éxito", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ username: "user1", password: "user1" });

    expect(res.statusCode).toBe(200);
  });
});

describe("Detalle de coche", () => {
  let token;

  beforeAll(async () => {
    await db.initDb();
    token = jwt.sign(JSON.stringify({ user: "user1" }), "supersecreto");
  });

  it("Usuario sin autenticar", async () => {
    const res = await request(app).get("/comprar-coche/:id");

    expect(res.statusCode).toBe(401);
  });

  it("Usuario autenticado", async () => {
    const res = await request(app)
      .get("/comprar-coche/1")
      .set("Cookie", `jwt=${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("0584KRT")
  });
});
