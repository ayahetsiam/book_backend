/**
 * but: controller les actions crud sur un auteur
 *      et captiver les erreurs systemes
 */
const writtenModel = require("../models/written_model");
const bookController = require("./book_controller");
const auteurController = require("./author_controller");

class WrittenController {
  constructor() {}

  async getWrittens() {
    try {
      const writtens = await writtenModel.getWrittens();
      /*if (writtens.length === 0) {
        throw new Error("Aucune donnéé");
      }*/
      return writtens;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des livres : " + error.message
      );
      throw error;
    }
  }

  async getWrittenByKey(key) {
    this.validateId(key);
    try {
      const written = await writtenModel.getWrittenByKey(key);
      if (!written) {
        throw new Error("Aucun livre trouvé");
      }
      return written;
    } catch (err) {
      console.error("Erreur de récupération : " + err.message);
      throw err;
    }
  }

  async researchWritten(query) {
    if (query !== "" && !isNaN(parseInt(query))) {
      try {
        const writtens = await this.getWrittens();
        const results = await writtenModel.researchWritten(query, writtens);
        if (results.length === 0) {
          throw new Error("Aucun résultat");
        }
        return results;
      } catch (err) {
        console.error("Erreur lors de la recherche du livre : " + err.message);
        throw err;
      }
    }
  }

  async createWritten(book_id, author_id) {
    if (await this.isCorrect(book_id, author_id)) {
      console.log("ama")
      try {
        const newDate = new Date().toISOString();
        return await writtenModel.createWritten(book_id, author_id, newDate);
      } catch (err) {
        console.error("Erreur lors de la création du livre : " + err.message);
        throw err;
      }
    } else {
      throw new Error("Les valeurs des champs sont incorrectes");
    }
  }

  async updateWritten(key, book_id, author_id) {
    this.validateKey(key);
    if (this.isCorrect(book_id, author_id)) {
      try {
        return await writtenModel.updateWritten(key, book_id, author_id);
      } catch (err) {
        console.error("Erreur lors de la mise à jour : " + err.message);
        throw err;
      }
    } else {
      throw new Error("Les valeurs des champs sont incorrectes");
    }
  }

  async deleteWritten(key) {
    this.validateKey(key);
    try {
      return await writtenModel.deleteWritten(key);
    } catch (err) {
      // console.error("Erreur de suppression : " + err.message);
      throw err;
    }
  }

  async checkRelationUnique(book_id, author_id) {
    try {
      const writtens = await this.getWrittens();
      return !writtens.some((w) => w._from == book_id && w._to == author_id);
    } catch (error) {
      console.error(
        "Erreur lors de la vérification de l'unicité de la relation :",
        error.message
      );
      throw error;
    }
  }

  async isCorrect(book_id, author_id) {
    if (book_id === "" && !isNaN(parseInt(book_id))) {
      throw new Error("l'id du livre n'est pas valide");
    }
    if (author_id === "" && !isNaN(parseInt(author_id))) {
      throw new Error("l'id de l'auteur n'est pas valide");
    }
    try {
      const bookExists = await bookController.checkBookExists(book_id);
      console.log(bookExists);
      const authorExists = await auteurController.checkAuthorExists(author_id);
      console.log(authorExists);
      const relationUnique = await this.checkRelationUnique(book_id, author_id);
      console.log(relationUnique);
      return true;
    } catch (error) {
      console.error("Erreur lors de la vérification de la relation:", error);
      throw error;
    }
  }

  async validateKey(key) {
    if (key === "" && isNaN(parseInt(key))) {
      throw new Error("la clé n'est pas valide");
    }
  }
}

module.exports = new WrittenController();
