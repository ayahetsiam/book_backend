// author_model.js
const db = require("../config/database_connection");
const authorCollection = db.collection("author");
class AuthorModel {
  constructor() {}

  async getAuthors() {
    const query = await db.query("FOR author IN author RETURN author");
    const authors = query.all();
    return authors;
  }

  async getAuthorByKey(key) {
    return await authorCollection.document(key);
  }

  async researchAuthor(query, authors) {
    const researchauthors = await authors.filter((a) => {
      return a.nom.includes(query) || a.prenom.includes(query);
    });
    return researchauthors;
  }

  async createAuthor(nom, prenom) {
    const author = { nom: nom, prenom: prenom };
    const result = await authorCollection.save(author);
    return this.getAuthorByKey(result._key);
  }

  async updateAuthor(key, newNom, newPrenom) {
    const newAuthor = await authorCollection.update(
      key,
      {
        nom: newNom,
        prenom: newPrenom,
      },
      {
        returnNew: true,
      }
    );

    return newAuthor.new;
  }

  async deleteAuthor(key) {
    await authorCollection.remove(key);
    return "ok";
  }
}

module.exports = new AuthorModel();
