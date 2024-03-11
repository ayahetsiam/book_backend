const { Database } = require("arangojs");

const db = new Database({
  url: "http://localhost:8529/",
  databaseName: "bookDB",
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

/*const { Database } = require("arangojs");

class DatabaseConnection {
  static instance = null;

  constructor() {
    if (this.instance === null) {
      try {
        this.instance = new Database({
          url: "http://localhost:8529/",
          databaseName: "bookDB",
          auth: {
            username: "root",
            password: "study",
          },
        });
      } catch (err) {
        console.error("Erreur de connexion : " + err);
      }
    }
  }

  static getDBInstance() {
    return this.instance;
  }
}*/

module.exports = db;
