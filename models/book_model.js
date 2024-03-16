const db = require("../config/database_connection");
const bookCollection = db.collection("book");

class BookModel {
  constructor() {}

  async getBooks() {
    const query = await db.query("FOR book IN book RETURN book");
    return query.all();
  }

  async getBookByKey(key) {
    return await bookCollection.document(key);
  }

  async getBookById(id) {
    const query = db.query(`
    FOR book IN book
    FILTER book._id == ${id}
    RETURN book
  `);

    return await db.query(query);
  }

  async researchBook(query) {
    const books = await this.getBooks();
    return books.filter(
      (b) => b.oeuvre.includes(query) || b.title.includes(query)
    );
  }

  async createBook(isdn, oeuvre, title) {
    a;
    const book = { ISDN: isdn, title: title, oeuvre: oeuvre };
    const insertion = await bookCollection.save(book);
    const newbook = await bookCollection.document(insertion._key);
    return newbook;
  }

  async createBook(isdn, title, oeuvre) {
    const book = { ISDN: isdn, title: title, oeuvre: oeuvre };
    const insertion = await bookCollection.save(book);
    const newbook = await bookCollection.document(insertion._key);
    return newbook;
  }

  async updateBook(key, title, oeuvre) {
    const update = await bookCollection.update(
      key,
      { title: title, oeuvre: oeuvre },
      { returnNew: true }
    );
    return update.new;
  }

  async deleteBook(key) {
    await bookCollection.remove(key);
    return "ok";
  }
}

module.exports = new BookModel();
