function getCoches(dbClient) {
  return dbClient.all("SELECT * FROM coches");
}

module.exports = {
  getCoches,
};
