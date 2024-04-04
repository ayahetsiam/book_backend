/**
 * but: controller les actions crud sur un auteur
 *      et captiver les erreurs systemes
 */

const bookModel = require("../models/book_model");

class BookController {
  constructor() {}

  async getBooks() {
    try {
      const books = await bookModel.getBooks();
      return books;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des libres: " + error.message
      );
      throw error;
    }
  }

  async getBookByKey(key) {
    this.validateKey(key);
    try {
      return await bookModel.getBookByKey(key);
    } catch (error) {
      throw error;
    }
  }

  async getBookByISBN(isbn) {
    try {
      return await bookModel.getBookByISBN(isbn);
    } catch (error) {
      throw error;
    }
  }

  async getBookByAuthor(author_id) {
    this.validateKey(author_id);
    try {
      return await bookModel.getBookbyAuthor(author_id);
    } catch (err) {
      throw err;
    }
  }

  async getBooksWrittenAt(date) {
    if (date !== "") {
      try {
        return await bookModel.getBooksWrittenAt(date);
      } catch (err) {
        console.error("Erreur de récuperation : " + err);
        throw err;
      }
    }
  }

  async researchBook(query) {
    query = query.trim();
    if (query === "" || !isNaN(parseInt(query))) {
      throw new Error("La requête n'est pas valide");
    }
    const results = await bookModel.researchBook(query);
    return results;
  }

  async createBook(isbn, title, artwork, page, author_id) {
    isbn = isbn.trim();
    title = title.trim();
    artwork = artwork.trim();
    this.validateField(isbn, title, artwork, page);
    const existingBook = await this.getBookByISBN(isbn);
    if (existingBook) {
      throw new Error("Ce livre existe déjà!");
    }
    if (author_id === "") {
      throw new Error("la valeur champ book est vide!");
    }
    const date = new Date();
    const writtenAt = date.toUTCString();
    console.log(writtenAt);
    try {
      const book = {
        ISBN: isbn,
        title: title,
        artwork: artwork,
        page: page,
        author_id: author_id,
        writtenAt: writtenAt,
      };
      return await bookModel.createBook(book);
    } catch (err) {
      console.error("Erreur lors de la création du livre : " + err.message);
      throw err;
    }
  }

  async updateBook(key, title, artwork, page) {
    this.validateKey(key);
    await this.getBookByKey(key);
    let updatedata = {};
    if (title) {
      if (!this.isCorrect(title)) {
        throw new Error("la valeur du title est incorrecte");
      }
      updatedata.title = title;
    }
    if (artwork) {
      if (!this.isCorrect(artwork)) {
        throw new Error("la valeur de l'oeuvre est incorrecte");
      }
      updatedata.artwork = artwork;
    }
    if (page) {
      if (page === "" || isNaN(parseInt(page))) {
        throw new Error("la valeur de page est incorrecte");
      }
      updatedata.page = page;
    }

    try {
      return await bookModel.updateBook(key, updatedata);
    } catch (err) {
      console.error("Erreur lors de la mise à jour : " + err.message);
      throw err;
    }
  }

  async deleteBook(key) {
    this.validateKey(key);
    await this.getBookByKey(key);
    try {
      return await bookModel.deleteBook(key);
    } catch (err) {
      console.error("Erreur de suppression : " + err.message);
      throw err;
    }
  }

  isCorrect(valeur) {
    return valeur !== "" && isNaN(parseInt(valeur));
  }

  validateField(isbn, title, artwork, page) {
    if (isbn === "") {
      throw new Error("la valeur du ISBN est incorrecte");
    }
    if (!this.isCorrect(title)) {
      throw new Error("la valeur du champ title est incorrecte");
    }
    if (!this.isCorrect(artwork)) {
      throw new Error("la valeur du champ oeuvre est incorrecte");
    }
    if (Number.isInteger(parseInt(page)) || page === 0 || isNaN(page)) {
      console.log(" .  . . .");
      throw new Error("la valeur du champ page est incorrecte");
    }
  }

  validateKey(key) {
    if (key === "" && isNaN(parseInt(key))) {
      throw new Error("la clé n'est pas valide");
    }
  }

}

module.exports = new BookController();
