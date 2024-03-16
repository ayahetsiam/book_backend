/**
 * but: controller les actions crud sur un auteur
 *      et captiver les erreurs systemes
 */
const bookModel = require("../models/book_model");

class BookController {
  constructor() {}

  async getBooks() {
    //let books = null;
    try {
      const books = await bookModel.getBooks();
      return books;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des libres: " + error.message
      );
    }
    /*if (books.length === 0) {
      throw new Error("Aucun livre");
    }*/
  }

  async getBookByKey(key) {
    this.validateKey(key);
    const book = await bookModel.getBookByKey(key);
    if (book === null) {
      throw new Error("Aucun livre trouvé");
    }
    return book;
  }

  async getBookById(id) {
    if (id === "") {
      throw new Error("L'id n'est pas vailidé");
    }
    const books = await this.getBooks();
    const book = books.find((book) => book._id == id);
    if (book == null) {
      throw new Error("Aucun livre trouvé");
    }
    return book;
  }

  async researchBook(query) {
    if (query === "" || isNaN(parseInt(query))) {
      throw new Error("La requête n'est pas valide");
    }
    const books = await this.getBooks();
    const results = await bookModel.researchBook(query, books);
    return results;
  }

  async createBook(isbn, title, oeuvre) {
    if (
      isbn === "" ||
      isNaN(parseInt(isbn)) ||
      !this.isCorrect(title, oeuvre)
    ) {
      throw new Error("Les valeurs des champs sont incorrectes");
    }
    if (await this.isIsbnExist(isbn)) {
      throw new Error("Ce livre existe déjà!");
    }
    try {
      return await bookModel.createBook(isbn, title, oeuvre);
    } catch (err) {
      console.error("Erreur lors de la création du livre : " + err.message);
      throw err; // Re-lance l'erreur pour la gestion par le code appelant
    }
  }

  async updateBook(key, title, oeuvre) {
    this.validateKey(key);
    if (!this.isCorrect(title, oeuvre)) {
      throw new Error("Les valeurs des champs sont incorrectes");
    }
    try {
      return await bookModel.updateBook(key, title, oeuvre);
    } catch (err) {
      console.error("Erreur lors de la mise à jour : " + err.message);
      throw err; // Re-lance l'erreur pour la gestion par le code appelant
    }
  }

  async deleteBook(key) {
    this.validateKey(key);
    try {
      return await bookModel.deleteBook(key);
    } catch (err) {
      console.error("Erreur de suppression : " + err.message);
      throw err; // Re-lance l'erreur pour la gestion par le code appelant
    }
  }

  isCorrect(title, oeuvre) {
    return (
      title !== "" &&
      oeuvre !== "" &&
      isNaN(parseInt(title)) &&
      isNaN(parseInt(oeuvre))
    );
  }

  async isIsbnExist(isbn) {
    const books = await this.getBooks();
    return books.some((book) => book.isbn === isbn);
  }

  async validateKey(key) {
    if (key === "" && isNaN(parseInt(key))) {
      throw new Error("la clé n'est pas valide");
    }
  }

  async checkBookExists(id) {
    const books = await this.getBooks();
    return books.some((book) => book._id == id);
  }
}

module.exports = new BookController();
