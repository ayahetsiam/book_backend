/**
 * but: controller les actions crud sur un auteur
 *      et captiver les erreurs systemes
 */
const authorModel = require("../models/author_model");
const bookModel = require("../models/book_model");
const bookController = require("./book_controller");
class AuthorController {
  constructor() {}

  async getAuthors() {
    try {
      const authors = await authorModel.getAuthors();
      return authors;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des auteurs: " + error.message
      );
      throw error;
    }
  }

  async getAuthorByKey(key) {
    this.validateKey(key);
    try {
      const author = await authorModel.getAuthorByKey(key);
      return author;
    } catch (err) {
      console.error("Erreur de récupération : " + err.message);
      throw err.message;
    }
  }

  async getBookAuthor(book_id) {
    this.validateKey(book_id);
    const book = bookController.checkBookExists(book_id);
    return this.getAuthorByKey(book.author_id);
  }

  async researchAuthor(query) {
    if (query !== "" && isNaN(parseInt(query))) {
      try {
        const researchAuthorResult = await authorModel.researchAuthor(query);
        if (researchAuthorResult.length === 0) {
          throw new Error("Aucun livre n'est trouvé");
        }
        return researchAuthorResult;
      } catch (err) {
        console.error(
          "Erreur lors de la recherche de l'auteur : " + err.message
        );
        throw err;
      }
    }
  }

  async createAuthor(name, firstName) {
    name = name.trim();
    firstName = firstName.trim();
    if (!this.isCorrect(name)) {
      throw new Error("la valeur du champ nom est incorrecte");
    }
    if (!this.isCorrect(firstName)) {
      throw new Error("la valeur du champ prenom est incorrecte");
    }
    try {
      const author = { name: name, fistName: fistName };
      return await authorModel.createAuthor(author);
    } catch (err) {
      console.error("Erreur lors de la création de l'auteur : " + err.message);
      throw err;
    }
  }

  async updateAuthor(key, name, fistName) {
    this.validateKey(key);
    await this.checkAuthorExists(key);
    let update = { name: name, fistName: fistName };
    if (!name) {
      update = { fistName: fistName };
    }
    if (!fistName) {
      update = { name: name };
    }
    if (!this.isCorrect(name)) {
      throw new Error("la valeur du champ nom est incorrecte");
    }
    if (!this.isCorrect(fistName)) {
      throw new Error("la valeur du champ prenoms est incorrecte");
    }
    try {
      return await authorModel.updateAuthor(key, update);
    } catch (err) {
      console.error("Erreur du modèle lors de la mise à jour: " + err.message);
      throw err;
    }
  }

  async deleteAuthor(key) {
    this.validateKey(key);
    const resultat = await this.checkAuthorExists(key);
    if (resultat === null) {
      throw new Error("L'auteur n'existe pas!");
    }
    const authors = await bookController.getBookByAuthor(key);
    if (Array.isArray(authors) && authors.length !== 0) {
      throw new Error(
        "Suppression impossible! Cet auteur est lié à au moins un livre"
      );
    }
    try {
      return await authorModel.deleteAuthor(key);
    } catch (err) {
      console.error("Erreur de suppression : " + err.message);
      throw err;
    }
  }

  validateKey(key) {
    if (key === "") {
      throw new Error("la clé n'est pas valide!");
    }
  }

  isCorrect(value) {
    return value !== "" && isNaN(parseInt(value));
  }

  async checkAuthorExists(key) {
    let author;
    try {
      author = await authorModel.getAuthorByKey(key);
    } catch {
      author = null;
    }
    if (!author) {
      throw new Error("l'auteur n'existe pas");
    }
    return author;
  }
}

module.exports = new AuthorController();
