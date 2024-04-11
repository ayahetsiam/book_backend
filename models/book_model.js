const db = require("../config/database_connection");
const bookCollection = db.collection("books");

class BookModel {
  constructor() {}

  async getBooks() {
    const query = await db.query("FOR book IN books RETURN book");
    return query.all();
  }

  async getBookByKey(key) {
    return await bookCollection.document(key);
  }

  async getBookByISBN(isbn) {
    const query = await db.query(
      `FOR book IN books FILTER book.ISBN == "${isbn}" RETURN book`
    );
    const result = await query.next();
    return result;
  }

  async getBookbyAuthor(author_id) {
    const query = await db.query(
      `FOR book IN books FILTER book.author == "${author_id}" RETURN book`
    );
    return query.all();
  }

  async getBooksWrittenAt(date) {
    const query = await db.query(
      `FOR book IN books FILTER book.writtenAt LIKE "%${date}%" RETURN book`
    );
    return query.all();
  }

  async researchBook(researchQuery) {
    const query = await db.query(
      `FOR book IN books FILTER book.title LIKE '%${researchQuery}%' OR book.artwork LIKE '%${researchQuery}%' OR book.ISDN LIKE '%${researchQuery}%' RETURN book`
    );
    return query.all();
  }

  async createBook(book) {
    const insertion = await bookCollection.save(book, { returnNew: true });
    return insertion.new;
  }

  async updateBook(key, updatedata) {
    const update = await bookCollection.update(key, updatedata, {
      returnNew: true,
    });
    console.log(update.new);
    return update.new;
  }

  async deleteBook(key) {
    await bookCollection.remove(key);
    return "ok";
  }
}

module.exports = new BookModel();
