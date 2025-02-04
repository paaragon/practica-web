const server = require("./server");
const db = require("./db");

(async () => {
  await db.initDb();
  await server.startServer();
})();
