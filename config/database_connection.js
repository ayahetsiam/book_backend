const { Database } = require("arangojs");

const db = new Database({
  url: "http://localhost:8529",
  databaseName: "livreDB",
  auth: {
    username: "root",
    password: "study",
  },
});

db.version()
  .then((versionInfo) => {
    console.log("Connexion établie avec succès !");
    console.log("Version du serveur ArangoDB :", versionInfo.version);
  })
  .catch((err) => {
    console.error("Erreur de connexion :", err);
  });

module.exports = db;
