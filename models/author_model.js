// author_model.js
const db = require("../config/database_connection");
const fsPromises = require("fs").promises;
const path = require("path");
const authorProvider = require("./author_provider");
class AuthorModel {
  constructor() {}

  async getAuthors() {
    console.log("ama");
    console.log(db);
    const bookCollection = db.collection("author");
    console.log(bookCollection);
    // Récupérer tous les documents de la collection
    const authors = await bookCollection.get();
    return authors;
  }

  getAuthorById(id) {
    const author = authorProvider.filter((a) => a.id == id);
    return author[0];
  }

  researchAuthor(query) {
    const authors = authorProvider.filter((a) => {
      return a.nom.includes(query) || a.prenom.includes(query);
    });
    return authors;
  }

  async createAuthor(nom, prenom) {
    const tableLength = authorProvider.length;
    const id = tableLength === 0 ? 1 : tableLength + 1; // Utiliser +1 ici plutôt que l'opérateur d'incrémentation postfixe
    console.log(tableLength);
    console.log(id);
    const author = { id: id, nom: nom, prenom: prenom };
    try {
      const providerPath = path.join(__dirname, "", "author_provider.js");
      const newProviderdata = [...authorProvider, author];
      try {
        await fsPromises.writeFile(
          providerPath,
          "const dataAuthor = " +
            JSON.stringify(newProviderdata) +
            ";\nmodule.exports = dataAuthor"
        );
      } catch (err) {
        console.error("Erreur d'écriture :", err);
        throw err; // Propager l'erreur vers l'appelant
      }
    } catch (err) {
      console.error("Erreur de creation :", err);
    }
    return author;
  }

  async updateAuthor(id, nom, prenom) {
    const oldAuthor = await this.getAuthorById(id);
    const newAuthor = { id: id, nom: nom, prenom: prenom };
    authorProvider[oldAuthor] = newAuthor;
    return newAuthor;
  }

  async deleteAuthor(id) {
    const deletedAuthor = await this.getAuthorById(id);
    authorProvider.pop(deletedAuthor);
    return {
      error: "suppression ok",
    };
  }
}

module.exports = new AuthorModel();
