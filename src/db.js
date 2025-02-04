const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
let dbClient = null;

function getDBClient() {
  return dbClient;
}

async function initDb() {
  dbClient = await open({
    filename: path.join(__dirname, "database.db"),
    driver: sqlite3.Database,
  });

  await dbClient.run(`
    CREATE TABLE IF NOT EXISTS coches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        marca TEXT NOT NULL,
        MODELO TEXT NOT NULL,
        MATRICULA TEXT
    )
    `);
}

module.exports = {
  getDBClient,
  initDb,
};
