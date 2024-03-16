/**
 * but: controller les actions crud sur un auteur
 *      et captiver les erreurs systemes
 */
const authorModel = require("../models/author_model");

class AuthorController {
  constructor() {}

  async getAuthors() {
    try {
      const authors = await authorModel.getAuthors();
      if (authors.length === 0) {
        throw new Error("Aucun auteur trouvé");
      }
      return authors;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des auteurs: " + error.message
      );
      throw error;
    }
  }

  async getAuthorByKey(key) {
    try {
      const author = await authorModel.getAuthorByKey(key);
      if (!author) {
        throw new Error("Aucun auteur trouvé");
      }
      return author;
    } catch (err) {
      console.error("Erreur de récupération : " + err.message);
      throw err;
    }
  }

  async getAuthorById(id) {
    if (id === "") {
      throw new Error("L'id n'est pas vailidé");
    }
    const authors = await this.getAuthors();
    const author = authors.find((author) => author._id == id);
    if (author == null) {
      throw new Error("Aucun auteur trouvé");
    }
    return author;
  }

  async researchAuthor(query) {
    if (query !== "" && !isNaN(parseInt(query))) {
      try {
        const authors = await this.getAuthors();
        return await authorModel.researchAuthor(query, authors);
      } catch (err) {
        console.error(
          "Erreur lors de la recherche de l'auteur : " + err.message
        );
        throw err;
      }
    }
  }

  async createAuthor(nom, prenom) {
    if (!this.isCorrect(nom, prenom)) {
    } else {
      throw new Error("Les valeurs des champs sont incorrectes");
    }
    try {
      return await authorModel.createAuthor(nom, prenom);
    } catch (err) {
      console.error("Erreur lors de la création de l'auteur : " + err.message);
      throw err;
    }
  }

  async updateAuthor(key, nom, prenom) {
    if (!this.isCorrect(nom, prenom)) {
      throw new Error("Les valeurs des champs sont incorrectes");
    }
    try {
      return await authorModel.updateAuthor(key, nom, prenom);
    } catch (err) {
      console.error("Erreur du modèle lors de la mise à jour: " + err.message);
      throw err;
    }
  }

  async deleteAuthor(key) {
    try {
      return await authorModel.deleteAuthor(key);
    } catch (err) {
      console.error("Erreur de suppression : " + err.message);
      throw err;
    }
  }

  isCorrect(nom, prenom) {
    return (
      nom !== "" &&
      prenom !== "" &&
      isNaN(parseInt(nom)) &&
      isNaN(parseInt(prenom))
    );
  }

  async checkAuthorExists(id) {
    const authors = await this.getAuthors();
    return authors.some((author) => author._id === id);
  }
}

module.exports = new AuthorController();
