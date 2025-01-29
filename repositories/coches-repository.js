function getCoches(dbClient) {
  return dbClient.all("SELECT * FROM coches");
}

function getCoche(dbClient, id) {
  return dbClient.get(`SELECT * FROM coches WHERE id = ${id}`);
}

module.exports = {
  getCoches,
  getCoche,
};
